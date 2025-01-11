import { Router } from "express";
// import authRouter from "./auth.router";
import chatRouter from "./chat.router";
import cityRouter from "./city.router";
import commentRouter from "./comment.router";
import focusAreaRouter from "./focusArea.router";
import organizationRouter from "./organization.router";
import postRouter from "./post.router";
import roleRouter from "./role.router";
import skillRouter from "./skill.router";
import userRouter from "./user.router";
import volunteerRouter from "./volunteer.router";

// Export the base-router
const baseRouter = Router();
baseRouter.use("/chats", chatRouter);
baseRouter.use("/cities", cityRouter);
baseRouter.use("/comments", commentRouter);
baseRouter.use("/focus-areas", focusAreaRouter);
baseRouter.use("/organizations", organizationRouter);
baseRouter.use("/posts", postRouter);
baseRouter.use("/roles", roleRouter); 
baseRouter.use("/skills", skillRouter);
baseRouter.use("/users", userRouter);
baseRouter.use("/volunteers", volunteerRouter);

export default baseRouter;
