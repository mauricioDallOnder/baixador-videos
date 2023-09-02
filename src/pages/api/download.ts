import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  try {
    const response = await axios.post('https://www.getfvid.com/downloader', {
      url: url
    });

    // Check if the video might be private
    if (response.data.includes("Uh-Oh! This video might be private and not publi")) {
      return res.status(400).json({ success: false, message: 'This video might be private and not public.' });
    }

    // Parse video title
    const titleRegex = /<p class="card-text">(.*?)<\/p>/g;
    const titleMatches = [...response.data.matchAll(titleRegex)];
    let videoTitle = titleMatches[0]?.[1] ?? ("noname " + Math.floor(Math.random() * 666) + ".mp4");

    // Parse download links
    const linkRegex = /<a href="(.+?)" target="_blank" class="btn btn-download"(.+?)>(.+?)<\/a>/g;
    const linkMatches = [...response.data.matchAll(linkRegex)];

    if (linkMatches.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid video URL or no download links found.' });
    }

    // For this example, we'll just grab the first available download link. 
    // You might want to refine this to provide options to the user or choose the best quality.
    const downloadLink = linkMatches[0][1].replace(/amp;/gi, '');

    // Optionally initiate the download server-side (be cautious about storage and bandwidth constraints!)
    // For now, we will just return the download link to the client.

    return res.status(200).json({ success: true, downloadLink, videoTitle });

  } catch (error : any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
