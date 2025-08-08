const BasePage = require('./BasePage');

class CalendarPage extends BasePage {
  constructor() {
    super();
    
    // Common selectors for calendar application
    this.selectors = {
      // Navigation
      header: 'header',
      title: 'h1, .title, .app-title',
      
      // Calendar views
      calendarContainer: '.calendar, #calendar, [data-testid="calendar"]',
      monthView: '.month-view, [data-testid="month-view"]',
      weekView: '.week-view, [data-testid="week-view"]',
      dayView: '.day-view, [data-testid="day-view"]',
      
      // Navigation buttons
      prevButton: '.prev, .previous, [data-testid="prev-button"]',
      nextButton: '.next, [data-testid="next-button"]',
      todayButton: '.today, [data-testid="today-button"]',
      
      // View switchers
      monthViewButton: '.month-view-btn, [data-testid="month-view-button"]',
      weekViewButton: '.week-view-btn, [data-testid="week-view-button"]',
      dayViewButton: '.day-view-btn, [data-testid="day-view-button"]',
      
      // Events
      event: '.event, .calendar-event, [data-testid="event"]',
      eventTitle: '.event-title, .event .title',
      eventTime: '.event-time, .event .time',
      
      // Event creation
      addEventButton: '.add-event, .create-event, [data-testid="add-event-button"]',
      eventForm: '.event-form, [data-testid="event-form"]',
      eventTitleInput: 'input[name="title"], #event-title, [data-testid="event-title-input"]',
      eventDescriptionInput: 'textarea[name="description"], #event-description, [data-testid="event-description-input"]',
      eventStartDateInput: 'input[name="startDate"], #start-date, [data-testid="event-start-date-input"]',
      eventEndDateInput: 'input[name="endDate"], #end-date, [data-testid="event-end-date-input"]',
      eventLocationInput: 'input[name="location"], #event-location, [data-testid="event-location-input"]',
      saveEventButton: '.save-event, [data-testid="save-event-button"]',
      cancelEventButton: '.cancel-event, [data-testid="cancel-event-button"]',
      
      // Modals and dialogs
      modal: '.modal, .dialog, [data-testid="modal"]',
      modalClose: '.modal-close, .close, [data-testid="modal-close"]',
      
      // Loading states
      loading: '.loading, .spinner, [data-testid="loading"]',
      
      // Error messages
      error: '.error, .error-message, [data-testid="error"]',
      success: '.success, .success-message, [data-testid="success"]'
    };
  }

  async waitForCalendarToLoad() {
    try {
      // Try to wait for calendar container with a reasonable timeout
      await this.waitForSelector(this.selectors.calendarContainer, { timeout: 5000 });
    } catch (error) {
      console.warn('⚠️ Calendar container not found, page might not be a calendar application');
      // Continue without calendar - some tests might still be valid
    }
    
    // Wait for any loading indicators to disappear
    try {
      await this.page.waitForSelector(this.selectors.loading, { hidden: true, timeout: 2000 });
    } catch (error) {
      // Loading indicator might not be present, continue
    }
  }

  async getPageTitle() {
    try {
      return await this.getText(this.selectors.title);
    } catch (error) {
      return await super.getPageTitle();
    }
  }

  async clickAddEvent() {
    await this.click(this.selectors.addEventButton);
  }

  async fillEventForm(eventData) {
    await this.waitForSelector(this.selectors.eventForm);
    
    if (eventData.title) {
      await this.clearAndType(this.selectors.eventTitleInput, eventData.title);
    }
    
    if (eventData.description) {
      await this.clearAndType(this.selectors.eventDescriptionInput, eventData.description);
    }
    
    if (eventData.startDate) {
      await this.clearAndType(this.selectors.eventStartDateInput, eventData.startDate);
    }
    
    if (eventData.endDate) {
      await this.clearAndType(this.selectors.eventEndDateInput, eventData.endDate);
    }
    
    if (eventData.location) {
      await this.clearAndType(this.selectors.eventLocationInput, eventData.location);
    }
  }

  async saveEvent() {
    await this.click(this.selectors.saveEventButton);
  }

  async cancelEvent() {
    await this.click(this.selectors.cancelEventButton);
  }

  async createEvent(eventData) {
    await this.clickAddEvent();
    await this.fillEventForm(eventData);
    await this.saveEvent();
  }

  async getEvents() {
    await this.waitForCalendarToLoad();
    const events = await this.page.$$(this.selectors.event);
    const eventData = [];
    
    for (const event of events) {
      try {
        const title = await event.$eval(this.selectors.eventTitle, el => el.textContent.trim()).catch(() => '');
        const time = await event.$eval(this.selectors.eventTime, el => el.textContent.trim()).catch(() => '');
        eventData.push({ title, time });
      } catch (error) {
        // Skip events that don't have the expected structure
      }
    }
    
    return eventData;
  }

  async getEventCount() {
    await this.waitForCalendarToLoad();
    return await this.getElementCount(this.selectors.event);
  }

  async clickEvent(index = 0) {
    const events = await this.page.$$(this.selectors.event);
    if (events[index]) {
      await events[index].click();
    } else {
      throw new Error(`Event at index ${index} not found`);
    }
  }

  async navigateToNextPeriod() {
    await this.click(this.selectors.nextButton);
  }

  async navigateToPreviousPeriod() {
    await this.click(this.selectors.prevButton);
  }

  async navigateToToday() {
    await this.click(this.selectors.todayButton);
  }

  async switchToMonthView() {
    await this.click(this.selectors.monthViewButton);
  }

  async switchToWeekView() {
    await this.click(this.selectors.weekViewButton);
  }

  async switchToDayView() {
    await this.click(this.selectors.dayViewButton);
  }

  async isMonthViewActive() {
    return await this.isVisible(this.selectors.monthView);
  }

  async isWeekViewActive() {
    return await this.isVisible(this.selectors.weekView);
  }

  async isDayViewActive() {
    return await this.isVisible(this.selectors.dayView);
  }

  async waitForEventFormToOpen() {
    await this.waitForSelector(this.selectors.eventForm);
  }

  async waitForEventFormToClose() {
    await this.page.waitForSelector(this.selectors.eventForm, { hidden: true, timeout: 10000 });
  }

  async isEventFormVisible() {
    return await this.isVisible(this.selectors.eventForm);
  }

  async closeModal() {
    if (await this.isVisible(this.selectors.modalClose)) {
      await this.click(this.selectors.modalClose);
    }
  }

  async waitForSuccessMessage() {
    await this.waitForSelector(this.selectors.success);
  }

  async waitForErrorMessage() {
    await this.waitForSelector(this.selectors.error);
  }

  async getSuccessMessage() {
    return await this.getText(this.selectors.success);
  }

  async getErrorMessage() {
    return await this.getText(this.selectors.error);
  }

  async hasSuccessMessage() {
    return await this.isVisible(this.selectors.success);
  }

  async hasErrorMessage() {
    return await this.isVisible(this.selectors.error);
  }
}

module.exports = CalendarPage;
