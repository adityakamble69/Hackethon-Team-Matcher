import {
  createRequest,
  getRequestById,
  updateRequestStatus,
  listSentRequests,
  listReceivedRequests
} from '../models/request.model.js';
import { getTeamForUser, createTeamWithMembers, addMemberToTeam } from '../models/team.model.js';
import { getProfileByUserId } from '../models/profile.model.js';

export async function sendRequest(req, res) {
  try {
    if (req.body.toUserId === req.user.id) {
      return res.status(400).json({ error: "Can't send a team request to yourself" });
    }
    const request = await createRequest(req.user.id, req.body.toUserId);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function respondToRequest(req, res) {
  try {
    const existing = await getRequestById(req.params.id);

    // Only the recipient of the request can accept/decline it.
    if (existing.to_user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }
    if (existing.status !== 'pending') {
      return res.status(400).json({ error: `Request already ${existing.status}` });
    }
    if (!['accepted', 'declined'].includes(req.body.status)) {
      return res.status(400).json({ error: "status must be 'accepted' or 'declined'" });
    }

    const request = await updateRequestStatus(req.params.id, req.body.status);

    if (request.status === 'accepted') {
      await formOrJoinTeam(existing.from_user_id, existing.to_user_id);
    }

    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// If either user already has a team, add the other into it. Otherwise create a new team.
async function formOrJoinTeam(userIdA, userIdB) {
  const [teamA, teamB] = await Promise.all([getTeamForUser(userIdA), getTeamForUser(userIdB)]);
  const existingTeam = teamA?.teams || teamB?.teams;

  if (existingTeam) {
    const missingMemberId = teamA ? userIdB : userIdA;
    const missingProfile = await getProfileByUserId(missingMemberId).catch(() => null);
    await addMemberToTeam(existingTeam.id, missingMemberId, missingProfile?.preferred_roles?.[0] || null);
    return existingTeam;
  }

  const [profileA, profileB] = await Promise.all([
    getProfileByUserId(userIdA).catch(() => null),
    getProfileByUserId(userIdB).catch(() => null),
  ]);
  const teamName = `${profileA?.name || 'Team'} & ${profileB?.name || 'Mate'}`;
  const hackathon = profileA?.hackathon || profileB?.hackathon || null;

  const team = await createTeamWithMembers(teamName, hackathon, [userIdA, userIdB]);
  return team;
}

export async function getSentRequests(req, res) {
  try {
    const requests = await listSentRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getReceivedRequests(req, res) {
  try {
    const requests = await listReceivedRequests(req.user.id);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
