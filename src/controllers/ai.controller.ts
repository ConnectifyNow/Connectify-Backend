import { Request, Response } from "express";
import OpenAI from "openai";

export class AiController {
  getAiDescription = async (req: Request, res: Response) => {
    try {
      const orgName = req.params.orgName;

      if (!orgName) {
        return res.status(400).json({ message: "org name is required" });
      }

      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: process.env.AI_KEY,
      });

      const completion = openai.chat.completions.create({
        model: "gpt-4o-mini",
        store: true,
        messages: [
          {
            role: "user",
            content: `generate description for an organization called ${orgName} without headers, straight description`,
          },
        ],
      });
      let description = "";
      completion.then((result) => {
        if (result.choices[0].message.content !== null) {
          res
            .status(200)
            .json({ description: result.choices[0].message.content });
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing AI request", error });
    }
  };
}

const aiController = new AiController();

export default aiController;
