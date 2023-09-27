import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Post a tweet
router.post("/", async (req, res) => {
  const { content, image, userId } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    const result = await prisma.tweet.create({
      data: { content, image, userId },
    });

    return res.status(201).json({
      status: true,
      message: "Tweet created successfully.",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

//list tweets
router.get("/", async (req, res) => {
  try {
    const tweets = await prisma.tweet.findMany({
      include: {
        user: {
          select: { id: true, username: true, image: true, email: true },
        },
      },
    });

    return res.status(200).json({
      status: true,
      message: "Tweets retrieved successfully.",
      data: tweets,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

//get single tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const tweet = await prisma.tweet.findUnique({
      where: { id: Number(id) },
    });

    if (!tweet) {
      return res.status(404).json({
        status: false,
        message: "Tweet not found.",
      });
    } else {
      return res.status(200).json({
        status: true,
        message: "Tweet found successfully.",
        data: tweet,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

//update tweet
router.put("/:id", (req, res) => {
  console.log("Update single tweet.");
});

//delete tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tweet = await prisma.tweet.findUnique({ where: { id: Number(id) } });

    if (!tweet) {
      return res.status(404).json({
        status: false,
        message: "Tweet not found.",
      });
    } else {
      await prisma.tweet.delete({ where: { id: Number(id) } });

      return res.status(201).json({
        status: true,
        message: "Data deleted successfully.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error.",
    });
  }
});

export default router;
