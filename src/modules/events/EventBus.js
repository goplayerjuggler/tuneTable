/**
 * EventBus for decoupled component communication
 * Replaces window.* global variable pattern
 */
class EventBus {
  constructor() {
    this.events = {};
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Function to call when event fires
   * @returns {Function} Unsubscribe function
   */
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        cb => cb !== callback
      );
    };
  }

  /**
   * Emit an event with data
   * @param {string} eventName - Name of the event
   * @param {*} data - Data to pass to listeners
   */
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Subscribe to an event that fires only once
   * @param {string} eventName - Name of the event
   * @param {Function} callback - Function to call when event fires
   */
  once(eventName, callback) {
    const unsubscribe = this.on(eventName, (data) => {
      callback(data);
      unsubscribe();
    });
  }

  /**
   * Remove all listeners for an event
   * @param {string} eventName - Name of the event
   */
  off(eventName) {
    delete this.events[eventName];
  }

  /**
   * Clear all events
   */
  clear() {
    this.events = {};
  }
}

// Export singleton instance
export const eventBus = new EventBus();
