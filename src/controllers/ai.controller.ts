import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class AiController {
  getAiDescription = async (req: Request, res: Response) => {
    try {
      const orgName = req.params.orgName;

      if (!orgName) {
        return res.status(400).json({ message: "org name is required" });
      }

      const genAI = new GoogleGenerativeAI(process.env.AI_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `generate description for an organization called ${orgName} without headers, straight description`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.status(200).json({ description: text });
    } catch (error) {
      console.error("Error processing Gemini AI request:", error);
      return res.status(500).json({ 
        message: "Error processing AI request", 
        error: error.message || "Unknown error" 
      });
    }
  };
}

const aiController = new AiController();

export default aiController;