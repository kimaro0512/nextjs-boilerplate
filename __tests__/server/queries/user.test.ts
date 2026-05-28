import { beforeEach, describe, expect, it, vi } from "vitest"

const dbMock = vi.hoisted(() => ({
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
}))

vi.mock("@/lib/db", () => ({
  db: dbMock,
}))

import { getAllUsers, getUserById } from "@/server/queries/user"

describe("user queries", () => {
  beforeEach(() => {
    dbMock.user.findMany.mockReset()
    dbMock.user.findUnique.mockReset()
  })

  it("fetches a public user profile by id", async () => {
    dbMock.user.findUnique.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
    })

    await getUserById("user-1")

    expect(dbMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    })
  })

  it("fetches users ordered newest first", async () => {
    dbMock.user.findMany.mockResolvedValue([])

    await getAllUsers()

    expect(dbMock.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  })
})
