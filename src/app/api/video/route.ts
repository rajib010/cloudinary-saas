import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching videos" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    
  } catch (error) {
    return NextResponse.json(
      { message: "Error when uploading a video" },
      { status: 500 }
    );
  }finally{
    await prisma.$disconnect()
  }
}
