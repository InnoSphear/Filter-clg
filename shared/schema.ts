import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  address: text("address").notNull(),
  annualFee: integer("annual_fee").notNull(),
  totalFee: integer("total_fee").notNull(),
  minMarks: integer("min_marks").notNull(),
  maxMarks: integer("max_marks").notNull(),
  category: text("category").notNull().default("MBBS"), // MBBS or MDMS
  imageUrl: text("image_url").default(""),
  description: text("description"),
  images: text("images").array().default([]),
  facilities: text("facilities").array().default([]),
  placementRate: decimal("placement_rate"),
  establishedYear: integer("established_year"),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  rating: decimal("rating").default("0"),
  reviewCount: integer("review_count").default(0),
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mainTitle: text("main_title").notNull().default("College Filter System"),
  subTitle: text("sub_title").notNull().default("Find Colleges That Match Your Profile"),
  description: text("description").notNull().default("Enter your budget, preferred state, and academic performance to discover colleges where you're eligible for admission."),
  fontFamily: text("font_family").notNull().default("Inter"),
  primaryColor: text("primary_color").notNull().default("#3b82f6"),
  logoUrl: text("logo_url").default(""),
  logoText: text("logo_text").default(""),
  budgetRanges: jsonb("budget_ranges").default(['100000-300000', '300000-500000', '500000-1000000', '1000000-1500000', '1500000-2000000', '2000000-2500000', '500000+']),
  whatsappNumber: text("whatsapp_number").default("+91 98765 43210"),
  whatsappButtonText: text("whatsapp_button_text").default("Connect on WhatsApp"),
  updatedAt: integer("updated_at").default(sql`extract(epoch from now())`),
});

export const studentInquiries = pgTable("student_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  budget: text("budget").notNull(),
  state: text("state").notNull(),
  marks: text("marks").notNull(),
  collegeType: text("college_type").notNull().default("MBBS"), // MBBS or MDMS
  applicationStatus: text("application_status").default("inquiry"), // inquiry, applied, admitted, rejected
  followupStatus: text("followup_status").default("pending"), // pending, contacted, closed
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// New tables for advanced features
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title").notNull(),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").default(false),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentEmail: text("student_email").notNull(),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  neetScore: integer("neet_score").notNull(),
  documents: jsonb("documents"),
  status: text("status").default("submitted"), // submitted, under_review, accepted, rejected
  applicationDate: timestamp("application_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scholarships = pgTable("scholarships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eligibilityCriteria: text("eligibility_criteria").notNull(),
  amount: integer("amount").notNull(),
  deadline: timestamp("deadline"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(), // page_view, search, filter, inquiry, application, comparison_view, whatsapp_click
  collegeId: varchar("college_id").references(() => colleges.id),
  studentEmail: text("student_email"),
  metadata: jsonb("metadata"),
  searchFilters: jsonb("search_filters"), // detailed filter criteria
  resultCount: integer("result_count"), // number of results returned
  userLocation: text("user_location"), // state/city for geographic analysis
  deviceType: text("device_type"), // mobile, desktop, tablet
  referrer: text("referrer"), // traffic source
  timeSpent: integer("time_spent"), // time on page/feature in seconds
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_analytics_event_type").on(table.eventType),
  index("idx_analytics_created_at").on(table.createdAt),
  index("idx_analytics_session_id").on(table.sessionId),
]);

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // email, sms, push
  recipient: text("recipient").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  status: text("status").default("pending"), // pending, sent, failed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comparisons = pgTable("comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentEmail: text("student_email").notNull(),
  collegeIds: text("college_ids").array().notNull(),
  comparisonData: jsonb("comparison_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User sessions for detailed tracking
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  location: text("location"),
  referrer: text("referrer"),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  pageViews: integer("page_views").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  inquiriesSubmitted: integer("inquiries_submitted").default(0),
  collegesViewed: text("colleges_viewed").array().default([]),
  conversions: integer("conversions").default(0), // WhatsApp clicks, inquiries, etc.
  bounceRate: boolean("is_bounce").default(false),
  isActive: boolean("is_active").default(true),
});

// Performance metrics for system monitoring
export const performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: text("metric_type").notNull(), // response_time, error_rate, search_performance, database_queries
  value: decimal("value").notNull(),
  endpoint: text("endpoint"),
  errorMessage: text("error_message"),
  userCount: integer("user_count"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Daily/Monthly aggregated stats
export const aggregatedStats = pgTable("aggregated_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(), // YYYY-MM-DD
  period: text("period").notNull(), // daily, weekly, monthly
  totalVisits: integer("total_visits").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  totalInquiries: integer("total_inquiries").default(0),
  conversionRate: decimal("conversion_rate").default("0"),
  avgSessionDuration: integer("avg_session_duration").default(0),
  topStates: jsonb("top_states"),
  topColleges: jsonb("top_colleges"),
  deviceBreakdown: jsonb("device_breakdown"),
  trafficSources: jsonb("traffic_sources"),
  popularSearchFilters: jsonb("popular_search_filters"),
});

// Email/SMS campaign tracking
export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // email, sms, whatsapp
  subject: text("subject"),
  content: text("content").notNull(),
  targetAudience: jsonb("target_audience"), // criteria for recipients
  recipientCount: integer("recipient_count").default(0),
  sentCount: integer("sent_count").default(0),
  deliveredCount: integer("delivered_count").default(0),
  openedCount: integer("opened_count").default(0),
  clickedCount: integer("clicked_count").default(0),
  unsubscribedCount: integer("unsubscribed_count").default(0),
  openRate: decimal("open_rate").default("0"),
  clickRate: decimal("click_rate").default("0"),
  conversionRate: decimal("conversion_rate").default("0"),
  status: text("status").default("draft"), // draft, scheduled, sending, sent, completed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const collegesRelations = relations(colleges, ({ many }) => ({
  reviews: many(reviews),
  scholarships: many(scholarships),
  applications: many(applications),
  favorites: many(favorites),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  college: one(colleges, {
    fields: [reviews.collegeId],
    references: [colleges.id],
  }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  college: one(colleges, {
    fields: [applications.collegeId],
    references: [colleges.id],
  }),
}));

export const scholarshipsRelations = relations(scholarships, ({ one }) => ({
  college: one(colleges, {
    fields: [scholarships.collegeId],
    references: [colleges.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  college: one(colleges, {
    fields: [favorites.collegeId],
    references: [colleges.id],
  }),
}));

// Insert schemas
export const insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export const insertStudentInquirySchema = createInsertSchema(studentInquiries).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applicationDate: true,
  updatedAt: true,
});

export const insertScholarshipSchema = createInsertSchema(scholarships).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  startTime: true,
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertAggregatedStatSchema = createInsertSchema(aggregatedStats).omit({
  id: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export const filterCollegeSchema = z.object({
  minBudget: z.number().min(0).optional(),
  maxBudget: z.number().min(0).optional(),
  state: z.string().optional(),
  obtainedMarks: z.number().min(0),
  marksRange: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type College = typeof colleges.$inferSelect;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type StudentInquiry = typeof studentInquiries.$inferSelect;
export type InsertStudentInquiry = z.infer<typeof insertStudentInquirySchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type AggregatedStat = typeof aggregatedStats.$inferSelect;
export type InsertAggregatedStat = z.infer<typeof insertAggregatedStatSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Comparison = typeof comparisons.$inferSelect;
export type Comparison = typeof comparisons.$inferSelect;
export type FilterCriteria = z.infer<typeof filterCollegeSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
