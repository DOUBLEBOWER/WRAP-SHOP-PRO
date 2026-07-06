import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "./db";

export const teamRouter = router({
  // Get all active team members
  list: protectedProcedure.query(async () => {
    return await getAllTeamMembers();
  }),

  // Create a new team member
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        role: z.string().min(1, "Role is required"),
        pin: z.string().min(4, "PIN must be at least 4 digits"),
      })
    )
    .mutation(async ({ input }) => {
      const id = `emp_${Date.now()}`;
      return await createTeamMember({
        id,
        name: input.name,
        role: input.role,
        pin: input.pin,
        isActive: true,
      });
    }),

  // Update a team member
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        role: z.string().optional(),
        pin: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return await updateTeamMember(id, updates);
    }),

  // Delete a team member (soft delete)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteTeamMember(input.id);
    }),
});
