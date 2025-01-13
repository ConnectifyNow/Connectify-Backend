import { Router } from "express";
import authRouter from "./auth.router";
import chatRouter from "./chat.router";
import cityRouter from "./city.router";
import commentRouter from "./comment.router";
import focusAreaRouter from "./focusArea.router";
import organizationRouter from "./organization.router";
import postRouter from "./post.router";
import skillRouter from "./skill.router";
import userRouter from "./user.router";
import volunteerRouter from "./volunteer.router";
import aiRouter from "./ai.router";

// Export the base-router
const baseRouter = Router();
baseRouter.use("/auth", authRouter);
baseRouter.use("/chats", chatRouter);
baseRouter.use("/cities", cityRouter);
baseRouter.use("/comments", commentRouter);
baseRouter.use("/focus-areas", focusAreaRouter);
baseRouter.use("/organizations", organizationRouter);
baseRouter.use("/posts", postRouter);
baseRouter.use("/skills", skillRouter);
baseRouter.use("/users", userRouter);
baseRouter.use("/volunteers", volunteerRouter);
baseRouter.use("/ai", aiRouter);

export default baseRouter;
