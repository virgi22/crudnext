import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { Id, Login, FirstName, LastName, DisplayName, Email, Password } = req.body;

  if (req.method === 'GET') {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } else if (req.method === 'POST') {
    const post = await prisma.user.create({
      data: {
        Login,
        FirstName,
        LastName,
        DisplayName,
        Email,
        Password,
      },
    });
    res.status(201).json(post);
  } else if (req.method === 'PUT') {
    const post = await prisma.user.update({
      where: { Id: Id },
      data: {
        Login,
        FirstName,
        LastName,
        DisplayName,
        Email,
        Password,
      },
    });
    res.status(201).json(post);
  } else if (req.method === 'DELETE') {
    const { Id } = req.query;
    const postId = typeof Id === 'string' ? parseInt(Id) : Array.isArray(Id) ? parseInt(Id[0]) : Id;
    const post = await prisma.user.delete({
      where: { Id: postId },
    });
    res.status(201).json(post);
  }
  else {
    res.status(405).end();
  }
}