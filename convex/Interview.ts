import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const SaveInterviewQuestion = mutation({
  args: {
    questions: v.any(),
    uid: v.id('UserTable'),
    resumeUrl: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    jobDescription: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert('InterviewSessionTable', {
      interviewQuestions: args.questions,
      resumeUrl: args.resumeUrl ?? null,
      userId: args.uid,
      status: 'darft',
      jobTitle: args.jobTitle ?? null,
      JobDescription: args.jobDescription ?? null
    });
    return result;
  }
});

