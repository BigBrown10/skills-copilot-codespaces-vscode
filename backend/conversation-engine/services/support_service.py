from typing import Dict, Any, Optional, List


class SupportService:
    """Handles customer support queries"""
    
    def __init__(self):
        self.knowledge_base = {
            "hours": "Our business hours are Monday to Friday, 9 AM to 6 PM.",
            "location": "We are located at 123 Main Street, City, State.",
            "contact": "You can reach us at support@example.com or call (555) 123-4567.",
            "refund": "Our refund policy allows returns within 30 days of purchase.",
            "shipping": "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days.",
            "payment": "We accept credit cards, PayPal, and bank transfers.",
        }
        
        self.faq = [
            {
                "question": "What are your business hours?",
                "answer": self.knowledge_base["hours"]
            },
            {
                "question": "Where are you located?",
                "answer": self.knowledge_base["location"]
            },
            {
                "question": "How can I contact support?",
                "answer": self.knowledge_base["contact"]
            },
            {
                "question": "What is your refund policy?",
                "answer": self.knowledge_base["refund"]
            },
        ]
    
    def search_knowledge_base(self, query: str) -> Optional[str]:
        """Search knowledge base for relevant information"""
        query_lower = query.lower()
        
        # Simple keyword matching
        keywords_map = {
            "hours": ["hours", "time", "open", "close"],
            "location": ["location", "address", "where"],
            "contact": ["contact", "email", "phone", "call"],
            "refund": ["refund", "return", "money back"],
            "shipping": ["shipping", "delivery", "ship"],
            "payment": ["payment", "pay", "card", "paypal"],
        }
        
        for topic, keywords in keywords_map.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return self.knowledge_base.get(topic)
        
        return None
    
    def get_faq(self) -> List[Dict[str, str]]:
        """Return frequently asked questions"""
        return self.faq
    
    def create_support_ticket(
        self,
        user_id: str,
        subject: str,
        description: str,
        priority: str = "normal"
    ) -> Dict[str, Any]:
        """Create a support ticket"""
        import uuid
        from datetime import datetime
        
        ticket = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "subject": subject,
            "description": description,
            "priority": priority,
            "status": "open",
            "created_at": datetime.now().isoformat(),
        }
        
        return ticket
    
    def escalate_to_human(self, conversation_id: str, reason: str) -> Dict[str, Any]:
        """Escalate conversation to human agent"""
        return {
            "escalated": True,
            "conversation_id": conversation_id,
            "reason": reason,
            "message": "I'm connecting you with a human agent who can better assist you.",
        }
