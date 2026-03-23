export enum ComplaintStatus {
  PENDING = "pending",
  RESOLVED = "resolved",
}

export enum ComplaintDirection {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

export enum ComplaintCategory {
  MISSED_BUS = "missed_bus",
  LATE_BUS = "late_bus",
  SAFETY = "safety",
  DRIVER_BEHAVIOR = "driver_behavior",
  VEHICLE_CONDITION = "vehicle_condition",
  OTHER = "other",
}
