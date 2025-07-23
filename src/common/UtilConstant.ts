export class UtilConstant{
        
        public static OrderStatus_REQUESTED_Msg="Please add the Order first."; 
        public static OrderStatus_ACTIVE_Msg = "Please assign Manger first.";
        public static OrderStatus_AWATING_PAYMENT_Msg = "Please complete all order type first.";
        public static OrderStatus_COMPLETE_Msg = "";
        public static UnAssign_Warning = "Are you sure that you want to Un Assign selected teams ?";
        public static UnAssign_Security_Group_Warning = "Are you sure that you want to Un Assign selected security groups ?";
        public static CANCEL_Msg = "Are you sure you want to cancel ?";
        public static ERROR_Msg = "Unable to fetch the record. Please contact administrator";
        public static ROW_COUNT = 25;
        public static Helpdesk_REQUESTED_Msg = "Please respond to request.";
        public static Helpdesk_RESPONDED_Msg = "Please assign Manger first.";
        public static Helpdesk_ASSIGNED_Msg = "Please wait for feedback first.";
        public static Helpdesk_AWAITING_Msg = "Working on feedbacks";
        public static Helpdesk_ONHOLD_Msg = "Working on feedbacks";
        public static Helpdesk_COMPLETE_Msg = "";
        public static PLAN_LIMIT_EXHAUSTED_MSG ="According to the current plan the number of records created are exceeded.";
        public static PLAN_LIMIT_Warning_MSG = UtilConstant.PLAN_LIMIT_EXHAUSTED_MSG +
                                                `
                                                Current Plan moved to 'pay as you go' for the current month.
                                                `;
        public static BOOKING_SUCCESSFUL = "Booking created successfully";  
        public static BOOKING_UPDATED_SUCCESSFUL = "Booking updated successfully";  
        public static DEFAULT_RECORDS = 12;   
        public static DEFAULT_CAPACITY = 'default_room_capacity';    
        public static UNABLE_TO_PROCESS_BOOKING = "Room is not available";
        public static UPDATE_SVG_ROOM = "Are you sure you want to update the room ?";
        public static MARK_NOT_RESERVE = `Are you sure that you want to make the selected room(s) not reservable ?`;
        public static MARK_RESERVE = `Are you sure that you want to make the selected room(s) reservable ?`; 
        public static ROW_COUNT_FIVE_LIMIT = 5;      
        public static DASHBOARD_AUTO_REFRESH_TIME_INTERVAL = "dashboard_refresh_time_interval";  
        public static LINK_PLANS_CONFIRMATION = "Are you sure that you want to link the selected plan(s)?";
        public static UN_LINK_PLANS_CONFIRMATION = "Are you sure that you want to un link the selected plan(s)?";   
        public static LINK_ASSETS_CONFIRMATION = "Are you sure that you want to link the selected Asset(s)?";
        public static UN_LINK_ASSETS_CONFIRMATION = "Are you sure that you want to un link the selected Asset(s)?";   
        public static NO_REQUESTS_FOUND = "No Requests found";
        public static RECORD_SAVED = "Record saved successfully.";
        public static TABLET_POTRAIT = '(min-width:600px) and (max-width:959px)';
        public static TABLET_LANDSCAPE = '(min-width:960px) and (max-width:1439px)';
        public static ROW_COUNT_TEN_LIMIT = 10;   
        public static SCROLL_LIMIT = 25;

}
