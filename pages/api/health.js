export default function handler(req, res) {
  res.status(200).json({ health: 'healthy' });
}
