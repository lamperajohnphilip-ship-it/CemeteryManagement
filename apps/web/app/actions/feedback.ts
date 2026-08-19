'use server';

import fs from 'fs';
import path from 'path';

const feedbackFilePath = path.join(process.cwd(), 'data', 'feedback.json');

// Ensure directory and file exist
function ensureFeedbackFile() {
  const dir = path.dirname(feedbackFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(feedbackFilePath)) {
    const defaultFeedback = [
      {
        id: 1780675554490,
        user_id: "User_4821",
        rating: 5,
        comment: "Excellent platform! Very easy to search and find deceased family members.",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: 1780675554491,
        user_id: "User_9120",
        rating: 4,
        comment: "Very helpful layout and smooth animations. The grave mapping works well.",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      }
    ];
    fs.writeFileSync(feedbackFilePath, JSON.stringify(defaultFeedback, null, 2), 'utf8');
  }
}

export async function getFeedback() {
  try {
    ensureFeedbackFile();
    const raw = fs.readFileSync(feedbackFilePath, 'utf8');
    const list = JSON.parse(raw);
    return { success: true, feedback: list };
  } catch (error: any) {
    console.error('Failed to get feedback:', error);
    return { success: false, error: error.message, feedback: [] };
  }
}

export async function saveFeedback(feedbackItem: { id?: number; user_id: string; rating: number; comment: string; date?: string }) {
  try {
    ensureFeedbackFile();
    const raw = fs.readFileSync(feedbackFilePath, 'utf8');
    const list = JSON.parse(raw);

    const newItem = {
      id: feedbackItem.id || Date.now(),
      user_id: feedbackItem.user_id,
      rating: feedbackItem.rating,
      comment: feedbackItem.comment,
      date: feedbackItem.date || new Date().toISOString()
    };

    list.unshift(newItem);
    fs.writeFileSync(feedbackFilePath, JSON.stringify(list, null, 2), 'utf8');
    return { success: true, feedback: newItem };
  } catch (error: any) {
    console.error('Failed to save feedback:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteFeedback(id: number) {
  try {
    ensureFeedbackFile();
    const raw = fs.readFileSync(feedbackFilePath, 'utf8');
    const list = JSON.parse(raw);

    const filtered = list.filter((item: any) => item.id !== id);
    fs.writeFileSync(feedbackFilePath, JSON.stringify(filtered, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete feedback:', error);
    return { success: false, error: error.message };
  }
}
