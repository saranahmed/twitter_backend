import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

//post user
router.post("/", async (req, res) => {
  const { email, name, username, bio } = req.body;

  try {
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (userExists) {
      if (userExists.email === email) {
        return res.status(409).json({
          status: false,
          message: "Email already exists.",
        });
      } else {
        return res.status(409).json({
          status: false,
          message: "Username already exists.",
        });
      }
    }

    const result = await prisma.user.create({
      data: { email, name, username, bio },
    });

    return res.status(201).json({
      status: true,
      message: "User created successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

//list users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, image: true },
    });
    return res.status(200).json({
      status: true,
      message: "Users retrieved successfully.",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

//get single user
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { tweets: true },
    });
    return res.status(200).json({
      status: true,
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
});

//update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { bio, name } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: { bio, name },
    });

    return res.status(200).json({
      status: true,
      message: "Data updated successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });

    return res.status(201).json({
      status: true,
      message: "Data deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

export default router;
