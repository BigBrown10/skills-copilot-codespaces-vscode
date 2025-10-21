from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import uuid


class BookingService:
    """Handles booking and appointment logic"""
    
    def __init__(self):
        # In production, this would connect to a real calendar/booking system
        self.bookings = {}
    
    def check_availability(self, date: str, time: Optional[str] = None) -> bool:
        """Check if a time slot is available"""
        # Simplified logic - in production, check against real calendar
        # For now, assume all slots are available
        return True
    
    def create_booking(
        self,
        customer_name: str,
        customer_phone: str,
        service_type: str,
        preferred_date: str,
        preferred_time: Optional[str] = None,
        customer_email: Optional[str] = None,
        notes: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Create a new booking"""
        
        booking_id = str(uuid.uuid4())
        
        # Parse date and time (simplified)
        try:
            if preferred_time:
                scheduled_at = datetime.strptime(
                    f"{preferred_date} {preferred_time}",
                    "%Y-%m-%d %H:%M"
                )
            else:
                scheduled_at = datetime.strptime(preferred_date, "%Y-%m-%d")
                scheduled_at = scheduled_at.replace(hour=9, minute=0)  # Default to 9 AM
        except:
            # If parsing fails, schedule for tomorrow at 9 AM
            scheduled_at = datetime.now() + timedelta(days=1)
            scheduled_at = scheduled_at.replace(hour=9, minute=0, second=0, microsecond=0)
        
        booking = {
            "id": booking_id,
            "customer_name": customer_name,
            "customer_phone": customer_phone,
            "customer_email": customer_email,
            "service_type": service_type,
            "scheduled_at": scheduled_at.isoformat(),
            "duration": 60,  # Default 60 minutes
            "status": "PENDING",
            "notes": notes,
            "created_at": datetime.now().isoformat(),
        }
        
        self.bookings[booking_id] = booking
        return booking
    
    def get_booking(self, booking_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a booking by ID"""
        return self.bookings.get(booking_id)
    
    def update_booking_status(self, booking_id: str, status: str) -> bool:
        """Update booking status"""
        if booking_id in self.bookings:
            self.bookings[booking_id]["status"] = status
            return True
        return False
    
    def cancel_booking(self, booking_id: str) -> bool:
        """Cancel a booking"""
        return self.update_booking_status(booking_id, "CANCELLED")
    
    def get_available_slots(self, date: str) -> list:
        """Get available time slots for a given date"""
        # Simplified - return some example slots
        return [
            "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
        ]
