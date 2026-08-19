import { getTeamForUser, getAllTeams } from '../models/team.model.js';
import { supabase } from '../config/supabaseClient.js';

export async function getMyTeam(req, res) {
  try {
    const membership = await getTeamForUser(req.user.id);
    if (!membership) {
      return res.json(null);
    }

    const { data: members, error } = await supabase
      .from('team_members')
      .select('user_id, role')
      .eq('team_id', membership.team_id);
    if (error) throw error;

    // team_members references auth.users, not profiles, directly — no FK for PostgREST
    // to auto-embed on, so fetch profile rows separately and stitch them in.
    const memberIds = members.map((m) => m.user_id);
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, name, preferred_roles, skills')
      .in('user_id', memberIds);
    if (profileError) throw profileError;
    const profileByUserId = Object.fromEntries(profiles.map((p) => [p.user_id, p]));

    const enrichedMembers = members.map((m) => ({
      user_id: m.user_id,
      role: m.role,
      name: profileByUserId[m.user_id]?.name,
      preferred_roles: profileByUserId[m.user_id]?.preferred_roles || [],
      skills: profileByUserId[m.user_id]?.skills || [],
    }));

    const filledRoles = enrichedMembers.flatMap((m) => m.preferred_roles);
    const allRoles = ['Frontend', 'Backend', 'Full-stack', 'Designer', 'ML/Data', 'PM/Ideation'];
    const missingRoles = allRoles.filter((r) => !filledRoles.includes(r));

    res.json({
      team: membership.teams,
      members: enrichedMembers,
      filled_roles: [...new Set(filledRoles)],
      missing_roles: missingRoles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Every formed team across the platform — powers the public "Teams" page.
export async function getAllTeamsHandler(req, res) {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
