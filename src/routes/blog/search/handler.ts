import { Request, Response, NextFunction } from "express";
import db from "../../../database/connect";
import { catchError } from "../../../utils/errors";
import { and, arrayContains, eq, ilike, or } from "drizzle-orm";
import { ARTICALS } from "../../../database/schema";
import fs from "fs";
import SearchQuery from "./query";
export async function SearchHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { q, limit, page } = req.query;

  const limitNum = Math.min(parseInt(limit as string) || 10, 100);
  const pageNum = parseInt(page as string) || 1;
  const query = q as string;
  console.log(limitNum);
  if (!q) {
    res.status(400).json({ message: "Please provide a search query" });
    return;
  }
  try {
    // const articals = await db.query.ARTICALS.findMany({
    //   where: (articles, { ilike, and, or, inArray }) =>
    //     and(
    //       or(
    //         ilike(articles.title, `%${parseQueryString(query)}%`),
    //         ilike(articles.description, `%${parseQueryString(query)}%`)
    //       ),
    //       inArray()
    //     ),
    //   limit: limitNum,
    //   offset: (pageNum - 1) * limitNum
    // });

    const limit = 10;
    const pageNumber = 2;

    const offset = (pageNumber - 1) * limit;

    const ROW_articals = await db.execute(SearchQuery(query, limit, offset));
    // const articals = ;
    // console.log(ROW_articals.rows);
    res.status(200).json({
      message: "Articals fetched successfully",
      articals: ROW_articals.rows,
      meta: {
        limit: limitNum,
        page: pageNum
      }
    });
  } catch (error) {
    console.log(error);
    catchError(error, next);
  }
}

function parseQueryString(q: string, type: "array" | "string" = "string") {
  const text = q.replace(/\+/g, " ");
  const array = text.split("+");

  if (type === "array") {
    return array;
  } else {
    return text;
  }
}
