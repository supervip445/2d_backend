/**
 * Session Helper - Determines current betting session based on time
 * Morning: 00:00 - 12:00
 * Evening: 12:04 - 16:30
 * Closed: Outside these times
 */

export type BetSession = 'morning' | 'evening' | 'closed';

export class SessionHelper {
  /**
   * Get current session based on Asia/Yangon timezone
   */
  static getCurrentSession(): BetSession {
    // Get current time in Asia/Yangon timezone
    const now = new Date();
    const yangonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    
    const hour = yangonTime.getHours();
    const minute = yangonTime.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Morning session: 00:00 - 12:00
    if (timeInMinutes >= 0 && timeInMinutes <= 12 * 60) {
      return 'morning';
    }
    // Evening session: 12:04 - 16:30
    else if (timeInMinutes >= (12 * 60 + 4) && timeInMinutes <= (16 * 60 + 30)) {
      return 'evening';
    }
    
    return 'closed';
  }

  /**
   * Get current date in Asia/Yangon timezone (YYYY-MM-DD format)
   */
  static getCurrentGameDate(): string {
    const now = new Date();
    const yangonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    return yangonTime.toISOString().split('T')[0];
  }

  /**
   * Get current time in Asia/Yangon timezone (HH:MM:SS format)
   */
  static getCurrentGameTime(): string {
    const now = new Date();
    const yangonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
    const hours = String(yangonTime.getHours()).padStart(2, '0');
    const minutes = String(yangonTime.getMinutes()).padStart(2, '0');
    const seconds = String(yangonTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}

