/**
 * Test data utilities for E2E tests
 */

class TestData {
  /**
   * Generate sample event data
   */
  static generateEventData(overrides = {}) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const defaultData = {
      title: `Test Event ${Date.now()}`,
      description: 'This is a test event created by E2E tests',
      startDate: tomorrow.toISOString().slice(0, 16), // Format for datetime-local input
      endDate: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16), // 1 hour later
      location: 'Test Location'
    };
    
    return { ...defaultData, ...overrides };
  }

  /**
   * Generate multiple event data objects
   */
  static generateMultipleEvents(count = 3) {
    const events = [];
    const baseDate = new Date();
    
    for (let i = 0; i < count; i++) {
      const eventDate = new Date(baseDate);
      eventDate.setDate(eventDate.getDate() + i);
      
      events.push(this.generateEventData({
        title: `Test Event ${i + 1}`,
        description: `Description for test event ${i + 1}`,
        startDate: eventDate.toISOString().slice(0, 16),
        endDate: new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
        location: `Location ${i + 1}`
      }));
    }
    
    return events;
  }

  /**
   * Generate event data with validation errors
   */
  static generateInvalidEventData() {
    return {
      emptyTitle: {
        title: '',
        description: 'Event with empty title',
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
      },
      
      longTitle: {
        title: 'a'.repeat(101), // Assuming max length is 100
        description: 'Event with title too long',
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
      },
      
      invalidDates: {
        title: 'Event with invalid dates',
        description: 'Event with end date before start date',
        startDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
        endDate: new Date().toISOString().slice(0, 16)
      },
      
      missingStartDate: {
        title: 'Event missing start date',
        description: 'Event without start date',
        endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
      },
      
      missingEndDate: {
        title: 'Event missing end date',
        description: 'Event without end date',
        startDate: new Date().toISOString().slice(0, 16)
      }
    };
  }

  /**
   * Generate event data for different time periods
   */
  static generateEventsByPeriod() {
    const now = new Date();
    
    return {
      today: this.generateEventData({
        title: 'Today Event',
        startDate: now.toISOString().slice(0, 16),
        endDate: new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
      }),
      
      tomorrow: this.generateEventData({
        title: 'Tomorrow Event',
        startDate: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        endDate: new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString().slice(0, 16)
      }),
      
      nextWeek: this.generateEventData({
        title: 'Next Week Event',
        startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString().slice(0, 16)
      }),
      
      nextMonth: this.generateEventData({
        title: 'Next Month Event',
        startDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString().slice(0, 16)
      })
    };
  }

  /**
   * Generate recurring event data
   */
  static generateRecurringEvents(baseTitle = 'Recurring Event', count = 5) {
    const events = [];
    const baseDate = new Date();
    
    for (let i = 0; i < count; i++) {
      const eventDate = new Date(baseDate);
      eventDate.setDate(eventDate.getDate() + (i * 7)); // Weekly recurrence
      
      events.push(this.generateEventData({
        title: `${baseTitle} ${i + 1}`,
        description: `Recurring event occurrence ${i + 1}`,
        startDate: eventDate.toISOString().slice(0, 16),
        endDate: new Date(eventDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
      }));
    }
    
    return events;
  }

  /**
   * Generate all-day event data
   */
  static generateAllDayEvent(overrides = {}) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const endDate = new Date(tomorrow);
    endDate.setHours(23, 59, 59, 999);
    
    return this.generateEventData({
      title: 'All Day Event',
      description: 'This is an all-day event',
      startDate: tomorrow.toISOString().slice(0, 10), // Date only
      endDate: endDate.toISOString().slice(0, 10), // Date only
      allDay: true,
      ...overrides
    });
  }

  /**
   * Generate event data with special characters
   */
  static generateSpecialCharacterEvent() {
    return this.generateEventData({
      title: 'Event with Special Characters: !@#$%^&*()_+-=[]{}|;:,.<>?',
      description: 'Description with émojis 🎉 and ñoñó characters',
      location: 'Location with "quotes" and \'apostrophes\''
    });
  }

  /**
   * Generate event data for boundary testing
   */
  static generateBoundaryTestEvents() {
    return {
      minimalEvent: {
        title: 'A', // Minimum length
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 60 * 1000).toISOString().slice(0, 16) // 1 minute duration
      },
      
      maximalEvent: {
        title: 'a'.repeat(100), // Maximum length (assuming 100 char limit)
        description: 'b'.repeat(1000), // Long description
        location: 'c'.repeat(200), // Long location
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16) // 24 hour duration
      }
    };
  }

  /**
   * Clean up test data (for use with API client)
   */
  static async cleanupTestEvents(apiClient) {
    try {
      // Get all events
      const response = await apiClient.get('/api/events');
      if (response.data && response.data.events && Array.isArray(response.data.events)) {
        // Delete events that match test patterns
        const testEvents = response.data.events.filter(event => 
          event && event.title && (
            event.title.includes('Test Event') || 
            event.title.includes('E2E Test') ||
            (event.description && event.description.includes('test event created by E2E tests'))
          )
        );
        
        for (const event of testEvents) {
          try {
            if (event.id) {
              await apiClient.delete(`/api/events/${event.id}`);
            }
          } catch (error) {
            console.warn(`Failed to delete test event ${event.id}:`, error.message);
          }
        }
        
        console.log(`🧹 Cleaned up ${testEvents.length} test events`);
      }
    } catch (error) {
      console.warn('Failed to cleanup test events:', error.message);
    }
  }

  /**
   * Wait for a specific amount of time (for testing time-based features)
   */
  static async wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Generate random string for unique identifiers
   */
  static generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Format date for display comparison
   */
  static formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  /**
   * Format time for display comparison
   */
  static formatTimeForDisplay(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }
}

module.exports = TestData;
