import {
  createRequest,
  updateRequestStatus,
  listSentRequests,
  listReceivedRequests
} from '../models/request.model.js';

export async function sendRequest(req, res) {
  try {
    const request = await createRequest(req.user.id, req.body.toUserId);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function respondToRequest(req, res) {
  try {
    // TODO: verify req.user.id === request.to_user_id before allowing update
    const request = await updateRequestStatus(req.params.id, req.body.status);
    // TODO: if status === 'accepted', create/update team via team.model.js
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
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
