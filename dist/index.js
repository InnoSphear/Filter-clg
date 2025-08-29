var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  admins: () => admins,
  aggregatedStats: () => aggregatedStats,
  analytics: () => analytics,
  applications: () => applications,
  applicationsRelations: () => applicationsRelations,
  campaigns: () => campaigns,
  changePasswordSchema: () => changePasswordSchema,
  colleges: () => colleges,
  collegesRelations: () => collegesRelations,
  comparisons: () => comparisons,
  favorites: () => favorites,
  favoritesRelations: () => favoritesRelations,
  filterCollegeSchema: () => filterCollegeSchema,
  insertAdminSchema: () => insertAdminSchema,
  insertAggregatedStatSchema: () => insertAggregatedStatSchema,
  insertAnalyticsSchema: () => insertAnalyticsSchema,
  insertApplicationSchema: () => insertApplicationSchema,
  insertCampaignSchema: () => insertCampaignSchema,
  insertCollegeSchema: () => insertCollegeSchema,
  insertPerformanceMetricSchema: () => insertPerformanceMetricSchema,
  insertReviewSchema: () => insertReviewSchema,
  insertScholarshipSchema: () => insertScholarshipSchema,
  insertSettingsSchema: () => insertSettingsSchema,
  insertStudentInquirySchema: () => insertStudentInquirySchema,
  insertUserSessionSchema: () => insertUserSessionSchema,
  notifications: () => notifications,
  performanceMetrics: () => performanceMetrics,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  scholarships: () => scholarships,
  scholarshipsRelations: () => scholarshipsRelations,
  settings: () => settings,
  studentInquiries: () => studentInquiries,
  userSessions: () => userSessions
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";
var colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  address: text("address").notNull(),
  annualFee: integer("annual_fee").notNull(),
  totalFee: integer("total_fee").notNull(),
  minMarks: integer("min_marks").notNull(),
  maxMarks: integer("max_marks").notNull(),
  category: text("category").notNull().default("MBBS"),
  // MBBS or MDMS
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
var admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var settings = pgTable("settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mainTitle: text("main_title").notNull().default("College Filter System"),
  subTitle: text("sub_title").notNull().default("Find Colleges That Match Your Profile"),
  description: text("description").notNull().default("Enter your budget, preferred state, and academic performance to discover colleges where you're eligible for admission."),
  fontFamily: text("font_family").notNull().default("Inter"),
  primaryColor: text("primary_color").notNull().default("#3b82f6"),
  logoUrl: text("logo_url").default(""),
  logoText: text("logo_text").default(""),
  budgetRanges: jsonb("budget_ranges").default(["100000-300000", "300000-500000", "500000-1000000", "1000000-1500000", "1500000-2000000", "2000000-2500000", "500000+"]),
  whatsappNumber: text("whatsapp_number").default("+91 98765 43210"),
  whatsappButtonText: text("whatsapp_button_text").default("Connect on WhatsApp"),
  updatedAt: integer("updated_at").default(sql`extract(epoch from now())`)
});
var studentInquiries = pgTable("student_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  budget: text("budget").notNull(),
  state: text("state").notNull(),
  marks: text("marks").notNull(),
  collegeType: text("college_type").notNull().default("MBBS"),
  // MBBS or MDMS
  applicationStatus: text("application_status").default("inquiry"),
  // inquiry, applied, admitted, rejected
  followupStatus: text("followup_status").default("pending"),
  // pending, contacted, closed
  notes: text("notes"),
  lastContactedAt: timestamp("last_contacted_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  rating: integer("rating").notNull(),
  // 1-5 stars
  title: text("title").notNull(),
  content: text("content").notNull(),
  isVerified: boolean("is_verified").default(false),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentEmail: text("student_email").notNull(),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  createdAt: timestamp("created_at").defaultNow()
});
var applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  studentName: text("student_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  neetScore: integer("neet_score").notNull(),
  documents: jsonb("documents"),
  status: text("status").default("submitted"),
  // submitted, under_review, accepted, rejected
  applicationDate: timestamp("application_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var scholarships = pgTable("scholarships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collegeId: varchar("college_id").notNull().references(() => colleges.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  eligibilityCriteria: text("eligibility_criteria").notNull(),
  amount: integer("amount").notNull(),
  deadline: timestamp("deadline"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  eventType: text("event_type").notNull(),
  // page_view, search, filter, inquiry, application, comparison_view, whatsapp_click
  collegeId: varchar("college_id").references(() => colleges.id),
  studentEmail: text("student_email"),
  metadata: jsonb("metadata"),
  searchFilters: jsonb("search_filters"),
  // detailed filter criteria
  resultCount: integer("result_count"),
  // number of results returned
  userLocation: text("user_location"),
  // state/city for geographic analysis
  deviceType: text("device_type"),
  // mobile, desktop, tablet
  referrer: text("referrer"),
  // traffic source
  timeSpent: integer("time_spent"),
  // time on page/feature in seconds
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => [
  index("idx_analytics_event_type").on(table.eventType),
  index("idx_analytics_created_at").on(table.createdAt),
  index("idx_analytics_session_id").on(table.sessionId)
]);
var notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  // email, sms, push
  recipient: text("recipient").notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  status: text("status").default("pending"),
  // pending, sent, failed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var comparisons = pgTable("comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentEmail: text("student_email").notNull(),
  collegeIds: text("college_ids").array().notNull(),
  comparisonData: jsonb("comparison_data"),
  createdAt: timestamp("created_at").defaultNow()
});
var userSessions = pgTable("user_sessions", {
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
  timeSpent: integer("time_spent").default(0),
  // in seconds
  inquiriesSubmitted: integer("inquiries_submitted").default(0),
  collegesViewed: text("colleges_viewed").array().default([]),
  conversions: integer("conversions").default(0),
  // WhatsApp clicks, inquiries, etc.
  bounceRate: boolean("is_bounce").default(false),
  isActive: boolean("is_active").default(true)
});
var performanceMetrics = pgTable("performance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: text("metric_type").notNull(),
  // response_time, error_rate, search_performance, database_queries
  value: decimal("value").notNull(),
  endpoint: text("endpoint"),
  errorMessage: text("error_message"),
  userCount: integer("user_count"),
  timestamp: timestamp("timestamp").defaultNow()
});
var aggregatedStats = pgTable("aggregated_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  // YYYY-MM-DD
  period: text("period").notNull(),
  // daily, weekly, monthly
  totalVisits: integer("total_visits").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  totalInquiries: integer("total_inquiries").default(0),
  conversionRate: decimal("conversion_rate").default("0"),
  avgSessionDuration: integer("avg_session_duration").default(0),
  topStates: jsonb("top_states"),
  topColleges: jsonb("top_colleges"),
  deviceBreakdown: jsonb("device_breakdown"),
  trafficSources: jsonb("traffic_sources"),
  popularSearchFilters: jsonb("popular_search_filters")
});
var campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  // email, sms, whatsapp
  subject: text("subject"),
  content: text("content").notNull(),
  targetAudience: jsonb("target_audience"),
  // criteria for recipients
  recipientCount: integer("recipient_count").default(0),
  sentCount: integer("sent_count").default(0),
  deliveredCount: integer("delivered_count").default(0),
  openedCount: integer("opened_count").default(0),
  clickedCount: integer("clicked_count").default(0),
  unsubscribedCount: integer("unsubscribed_count").default(0),
  openRate: decimal("open_rate").default("0"),
  clickRate: decimal("click_rate").default("0"),
  conversionRate: decimal("conversion_rate").default("0"),
  status: text("status").default("draft"),
  // draft, scheduled, sending, sent, completed
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var collegesRelations = relations(colleges, ({ many }) => ({
  reviews: many(reviews),
  scholarships: many(scholarships),
  applications: many(applications),
  favorites: many(favorites)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  college: one(colleges, {
    fields: [reviews.collegeId],
    references: [colleges.id]
  })
}));
var applicationsRelations = relations(applications, ({ one }) => ({
  college: one(colleges, {
    fields: [applications.collegeId],
    references: [colleges.id]
  })
}));
var scholarshipsRelations = relations(scholarships, ({ one }) => ({
  college: one(colleges, {
    fields: [scholarships.collegeId],
    references: [colleges.id]
  })
}));
var favoritesRelations = relations(favorites, ({ one }) => ({
  college: one(colleges, {
    fields: [favorites.collegeId],
    references: [colleges.id]
  })
}));
var insertCollegeSchema = createInsertSchema(colleges).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true
});
var insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true
});
var insertStudentInquirySchema = createInsertSchema(studentInquiries).omit({
  id: true,
  createdAt: true
});
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});
var insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applicationDate: true,
  updatedAt: true
});
var insertScholarshipSchema = createInsertSchema(scholarships).omit({
  id: true,
  createdAt: true
});
var insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  createdAt: true
});
var insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  startTime: true
});
var insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
  timestamp: true
});
var insertAggregatedStatSchema = createInsertSchema(aggregatedStats).omit({
  id: true
});
var insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true
});
var filterCollegeSchema = z.object({
  minBudget: z.number().min(0).optional(),
  maxBudget: z.number().min(0).optional(),
  state: z.string().optional(),
  obtainedMarks: z.number().min(0),
  marksRange: z.string().optional()
});
var changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, gte, lte, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getAllColleges() {
    return await db.select().from(colleges).orderBy(colleges.name);
  }
  async getCollegeById(id) {
    const [college] = await db.select().from(colleges).where(eq(colleges.id, id));
    return college;
  }
  async createCollege(college) {
    const [newCollege] = await db.insert(colleges).values({ ...college, updatedAt: /* @__PURE__ */ new Date() }).returning();
    return newCollege;
  }
  async updateCollege(id, college) {
    const [updatedCollege] = await db.update(colleges).set({ ...college, updatedAt: /* @__PURE__ */ new Date() }).where(eq(colleges.id, id)).returning();
    return updatedCollege;
  }
  async deleteCollege(id) {
    const result = await db.delete(colleges).where(eq(colleges.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  async filterColleges(criteria) {
    const conditions = [];
    if (criteria.minBudget || criteria.maxBudget) {
      if (criteria.minBudget) {
        conditions.push(gte(colleges.totalFee, criteria.minBudget));
      }
      if (criteria.maxBudget) {
        conditions.push(lte(colleges.totalFee, criteria.maxBudget));
      }
    }
    if (criteria.state && criteria.state !== "all") {
      conditions.push(eq(colleges.state, criteria.state));
    }
    if (criteria.obtainedMarks) {
      conditions.push(
        and(
          lte(colleges.minMarks, criteria.obtainedMarks),
          gte(colleges.maxMarks, criteria.obtainedMarks)
        )
      );
    }
    return await db.select().from(colleges).where(conditions.length > 0 ? and(...conditions) : void 0).orderBy(colleges.name);
  }
  async getAdminByUsername(username) {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin;
  }
  async createAdmin(admin) {
    const [newAdmin] = await db.insert(admins).values(admin).returning();
    return newAdmin;
  }
  async changeAdminPassword(username, data) {
    const result = await db.update(admins).set({ password: data.newPassword }).where(eq(admins.username, username));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  async getSettings() {
    const [settingsRecord] = await db.select().from(settings).limit(1);
    if (!settingsRecord) {
      const defaultSettings = {
        mainTitle: "College Filter System",
        subTitle: "Find Colleges That Match Your Profile",
        description: "Enter your budget, preferred state, and academic performance to discover colleges where you're eligible for admission.",
        fontFamily: "Inter",
        primaryColor: "#3b82f6",
        logoUrl: "",
        logoText: "",
        budgetRanges: ["100000-300000", "300000-500000", "500000-1000000", "1000000-1500000", "1500000-2000000", "2000000-2500000", "2500000+"]
      };
      const [newSettings] = await db.insert(settings).values(defaultSettings).returning();
      return newSettings;
    }
    return settingsRecord;
  }
  async updateSettings(settingsData) {
    const currentSettings = await this.getSettings();
    const [updatedSettings] = await db.update(settings).set({ ...settingsData, updatedAt: Math.floor(Date.now() / 1e3) }).where(eq(settings.id, currentSettings.id)).returning();
    return updatedSettings;
  }
  async createStudentInquiry(inquiry) {
    const [newInquiry] = await db.insert(studentInquiries).values(inquiry).returning();
    return newInquiry;
  }
  async getAllStudentInquiries() {
    return await db.select().from(studentInquiries).orderBy(desc(studentInquiries.createdAt));
  }
  async getCollegeReviews(collegeId) {
    return await db.select().from(reviews).where(and(eq(reviews.collegeId, collegeId), eq(reviews.isVisible, true))).orderBy(desc(reviews.createdAt));
  }
  async addReview(review) {
    const [newReview] = await db.insert(reviews).values(review).returning();
    const collegeReviews = await this.getCollegeReviews(review.collegeId);
    const avgRating = collegeReviews.reduce((sum, r) => sum + r.rating, 0) / collegeReviews.length;
    await db.update(colleges).set({
      rating: avgRating.toFixed(1),
      reviewCount: collegeReviews.length,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(colleges.id, review.collegeId));
    return newReview;
  }
  async getApplications() {
    return await db.select().from(applications).orderBy(desc(applications.applicationDate));
  }
  async addApplication(application) {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }
  async updateApplication(id, data) {
    const [updatedApplication] = await db.update(applications).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(applications.id, id)).returning();
    return updatedApplication;
  }
  async getScholarships(collegeId) {
    if (collegeId) {
      return await db.select().from(scholarships).where(and(eq(scholarships.isActive, true), eq(scholarships.collegeId, collegeId))).orderBy(scholarships.deadline);
    }
    return await db.select().from(scholarships).where(eq(scholarships.isActive, true)).orderBy(scholarships.deadline);
  }
  async addScholarship(scholarship) {
    const [newScholarship] = await db.insert(scholarships).values(scholarship).returning();
    return newScholarship;
  }
  async logAnalytics(analyticsData) {
    const [newAnalytics] = await db.insert(analytics).values(analyticsData).returning();
    return newAnalytics;
  }
  async getAnalytics(eventType, startDate, endDate) {
    const conditions = [];
    if (eventType) {
      conditions.push(eq(analytics.eventType, eventType));
    }
    if (startDate) {
      conditions.push(gte(analytics.createdAt, startDate));
    }
    if (endDate) {
      conditions.push(lte(analytics.createdAt, endDate));
    }
    return await db.select().from(analytics).where(conditions.length > 0 ? and(...conditions) : void 0).orderBy(desc(analytics.createdAt));
  }
  async getFavorites(studentEmail) {
    return await db.select().from(favorites).where(eq(favorites.studentEmail, studentEmail)).orderBy(desc(favorites.createdAt));
  }
  async addFavorite(studentEmail, collegeId) {
    const [newFavorite] = await db.insert(favorites).values({ studentEmail, collegeId }).returning();
    return newFavorite;
  }
  async removeFavorite(studentEmail, collegeId) {
    const result = await db.delete(favorites).where(and(eq(favorites.studentEmail, studentEmail), eq(favorites.collegeId, collegeId)));
    return result.rowCount ? result.rowCount > 0 : false;
  }
  async saveComparison(studentEmail, collegeIds, comparisonData) {
    const [newComparison] = await db.insert(comparisons).values({ studentEmail, collegeIds, comparisonData }).returning();
    return newComparison;
  }
  async getComparisons(studentEmail) {
    return await db.select().from(comparisons).where(eq(comparisons.studentEmail, studentEmail)).orderBy(desc(comparisons.createdAt));
  }
  // Enhanced Analytics Methods
  async getDashboardAnalytics(timeframe) {
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 1;
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - days);
    const pageViews = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "page_view"),
        gte(analytics.createdAt, startDate)
      )
    );
    const uniqueSessionIds = new Set(pageViews.map((view) => view.sessionId).filter(Boolean));
    const uniqueVisitors = uniqueSessionIds.size;
    const inquiries = await db.select().from(studentInquiries).where(gte(studentInquiries.createdAt, startDate));
    const totalInquiries = inquiries.length;
    const conversionRate = pageViews.length > 0 ? totalInquiries / uniqueVisitors * 100 : 0;
    const stateCount = inquiries.reduce((acc, inquiry) => {
      acc[inquiry.state] = (acc[inquiry.state] || 0) + 1;
      return acc;
    }, {});
    const topStates = Object.entries(stateCount).map(([state, count]) => ({ state, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const collegeViews = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "college_view"),
        gte(analytics.createdAt, startDate)
      )
    );
    const collegeCount = collegeViews.reduce((acc, view) => {
      if (view.collegeId) {
        acc[view.collegeId] = (acc[view.collegeId] || 0) + 1;
      }
      return acc;
    }, {});
    const topCollegeIds = Object.entries(collegeCount).sort(([, a], [, b]) => b - a).slice(0, 5);
    const topColleges = await Promise.all(
      topCollegeIds.map(async ([collegeId, views]) => {
        const [college] = await db.select().from(colleges).where(eq(colleges.id, collegeId));
        return { college: college?.name || "Unknown", views };
      })
    );
    const deviceCount = pageViews.reduce((acc, view) => {
      const device = view.deviceType || "unknown";
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});
    const deviceBreakdown = Object.entries(deviceCount).map(([device, count]) => ({ device, count }));
    const sourceCount = pageViews.reduce((acc, view) => {
      const source = view.referrer || "direct";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    const trafficSources = Object.entries(sourceCount).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const inquiryTrends = [];
    for (let i = 0; i < days; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const dayInquiries = inquiries.filter(
        (inquiry) => inquiry.createdAt && inquiry.createdAt >= dayStart && inquiry.createdAt <= dayEnd
      );
      inquiryTrends.unshift({
        date: dayStart.toISOString().split("T")[0],
        count: dayInquiries.length
      });
    }
    const avgSessionDuration = 180;
    const bounceRate = 45;
    return {
      totalVisits: pageViews.length,
      uniqueVisitors,
      totalInquiries,
      conversionRate: Math.round(conversionRate * 100) / 100,
      topStates,
      topColleges,
      deviceBreakdown,
      trafficSources,
      inquiryTrends,
      avgSessionDuration,
      bounceRate
    };
  }
  async getCollegeAnalytics(collegeId) {
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - 30);
    const views = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "college_view"),
        eq(analytics.collegeId, collegeId),
        gte(analytics.createdAt, startDate)
      )
    );
    const uniqueViews = new Set(views.map((view) => view.sessionId).filter(Boolean)).size;
    const collegeInquiries = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "inquiry"),
        eq(analytics.collegeId, collegeId),
        gte(analytics.createdAt, startDate)
      )
    );
    const whatsappClicks = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "whatsapp_click"),
        eq(analytics.collegeId, collegeId),
        gte(analytics.createdAt, startDate)
      )
    );
    const [college] = await db.select().from(colleges).where(eq(colleges.id, collegeId));
    const avgRating = college?.rating ? parseFloat(college.rating) : 0;
    const reviewCount = college?.reviewCount || 0;
    const sourceCount = views.reduce((acc, view) => {
      const source = view.referrer || "direct";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    const topTrafficSources = Object.entries(sourceCount).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 5);
    const viewTrends = [];
    for (let i = 0; i < 30; i++) {
      const date = /* @__PURE__ */ new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      const dayViews = views.filter(
        (view) => view.createdAt && view.createdAt >= dayStart && view.createdAt <= dayEnd
      );
      viewTrends.unshift({
        date: dayStart.toISOString().split("T")[0],
        views: dayViews.length
      });
    }
    return {
      totalViews: views.length,
      uniqueViews,
      inquiries: collegeInquiries.length,
      whatsappClicks: whatsappClicks.length,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount,
      topTrafficSources,
      viewTrends
    };
  }
  async getDetailedReports(type, timeframe) {
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 90;
    const startDate = /* @__PURE__ */ new Date();
    startDate.setDate(startDate.getDate() - days);
    switch (type) {
      case "user_behavior":
        return this.getUserBehaviorReport(startDate);
      case "conversion_funnel":
        return this.getConversionFunnelReport(startDate);
      case "geographic_distribution":
        return this.getGeographicReport(startDate);
      case "college_performance":
        return this.getCollegePerformanceReport(startDate);
      default:
        return {};
    }
  }
  async getUserBehaviorReport(startDate) {
    const analytics2 = await db.select().from(analytics2).where(gte(analytics2.createdAt, startDate));
    const sessionData = analytics2.reduce((acc, event) => {
      if (!event.sessionId) return acc;
      if (!acc[event.sessionId]) {
        acc[event.sessionId] = {
          events: [],
          startTime: event.createdAt,
          endTime: event.createdAt,
          deviceType: event.deviceType,
          userLocation: event.userLocation
        };
      }
      acc[event.sessionId].events.push(event);
      if (event.createdAt > acc[event.sessionId].endTime) {
        acc[event.sessionId].endTime = event.createdAt;
      }
      return acc;
    }, {});
    return {
      totalSessions: Object.keys(sessionData).length,
      avgSessionDuration: Object.values(sessionData).reduce((sum, session) => {
        const duration = session.endTime.getTime() - session.startTime.getTime();
        return sum + duration / 1e3 / 60;
      }, 0) / Object.keys(sessionData).length,
      deviceDistribution: Object.values(sessionData).reduce((acc, session) => {
        const device = session.deviceType || "unknown";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {}),
      mostCommonUserFlow: this.analyzeUserFlow(Object.values(sessionData))
    };
  }
  async getConversionFunnelReport(startDate) {
    const pageViews = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "page_view"),
        gte(analytics.createdAt, startDate)
      )
    );
    const searches = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "search"),
        gte(analytics.createdAt, startDate)
      )
    );
    const collegeViews = await db.select().from(analytics).where(
      and(
        eq(analytics.eventType, "college_view"),
        gte(analytics.createdAt, startDate)
      )
    );
    const inquiries = await db.select().from(studentInquiries).where(gte(studentInquiries.createdAt, startDate));
    return {
      funnel: [
        { stage: "Visits", count: pageViews.length, conversionRate: 100 },
        { stage: "Searches", count: searches.length, conversionRate: searches.length / pageViews.length * 100 },
        { stage: "College Views", count: collegeViews.length, conversionRate: collegeViews.length / searches.length * 100 },
        { stage: "Inquiries", count: inquiries.length, conversionRate: inquiries.length / collegeViews.length * 100 }
      ]
    };
  }
  async getGeographicReport(startDate) {
    const inquiries = await db.select().from(studentInquiries).where(gte(studentInquiries.createdAt, startDate));
    const stateDistribution = inquiries.reduce((acc, inquiry) => {
      acc[inquiry.state] = (acc[inquiry.state] || 0) + 1;
      return acc;
    }, {});
    return {
      stateDistribution: Object.entries(stateDistribution).map(([state, count]) => ({ state, count, percentage: count / inquiries.length * 100 })).sort((a, b) => b.count - a.count)
    };
  }
  async getCollegePerformanceReport(startDate) {
    const allColleges = await this.getAllColleges();
    const performanceData = await Promise.all(
      allColleges.map(async (college) => {
        const views = await db.select().from(analytics).where(
          and(
            eq(analytics.eventType, "college_view"),
            eq(analytics.collegeId, college.id),
            gte(analytics.createdAt, startDate)
          )
        );
        const inquiries = await db.select().from(analytics).where(
          and(
            eq(analytics.eventType, "inquiry"),
            eq(analytics.collegeId, college.id),
            gte(analytics.createdAt, startDate)
          )
        );
        return {
          collegeName: college.name,
          views: views.length,
          inquiries: inquiries.length,
          conversionRate: views.length > 0 ? inquiries.length / views.length * 100 : 0,
          rating: college.rating ? parseFloat(college.rating) : 0
        };
      })
    );
    return {
      colleges: performanceData.sort((a, b) => b.views - a.views)
    };
  }
  analyzeUserFlow(sessions) {
    const flows = sessions.map(
      (session) => session.events.map((event) => event.eventType).join(" -> ")
    );
    const flowCount = flows.reduce((acc, flow) => {
      acc[flow] = (acc[flow] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(flowCount).sort(([, a], [, b]) => b - a).slice(0, 5).map(([flow, count]) => ({ flow, count }));
  }
};
var storage = new DatabaseStorage();

// server/data-import.ts
var privateMedicalColleges = [
  // Karnataka Private Medical Colleges
  {
    name: "Manipal College of Medical Sciences",
    location: "Manipal, Karnataka",
    state: "Karnataka",
    address: "Tiger Circle Road, Madhav Nagar, Manipal, Karnataka 576104",
    annualFee: 18e5,
    // ₹18 lakhs per year
    totalFee: 99e5,
    // ₹99 lakhs total (5.5 years)
    minMarks: 580,
    maxMarks: 650,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3",
    description: "Premier private medical college under Manipal Academy of Higher Education. Known for excellent infrastructure and clinical training.",
    phone: "+91-820-2922327",
    email: "admissions@manipal.edu",
    website: "https://manipal.edu/mcoms.html",
    establishedYear: 1953,
    accreditation: "NAAC A+, NMC Approved",
    facilityType: "Private University",
    hostelAvailable: true,
    totalStudents: 2500,
    facultyCount: 180,
    studentsPerFaculty: 14,
    affiliatedUniversity: "Manipal Academy of Higher Education",
    recognizedBy: "NMC, WHO",
    courseStructure: "Pre-clinical 2 years, Para-clinical 1 year, Clinical 2 years, Internship 1 year",
    libraryFacilities: "Central library with 50,000+ medical books and e-journals",
    labFacilities: "Modern anatomy, physiology, biochemistry, pathology, microbiology labs",
    researchPrograms: "Active research in cardiology, neurology, oncology",
    placementInfo: "100% placement in internships, PG entrance coaching available",
    scholarshipsOffered: "Merit scholarships, need-based financial aid",
    admissionProcess: "NEET UG based admission through Karnataka NEET counselling",
    applicationDeadline: "2024-08-15",
    isActive: true,
    rating: 4.4,
    reviewsCount: 0
  },
  {
    name: "JSS Medical College",
    location: "Mysore, Karnataka",
    state: "Karnataka",
    address: "SS Nagara, Mysuru, Karnataka 570015",
    annualFee: 15e5,
    // ₹15 lakhs per year
    totalFee: 825e4,
    // ₹82.5 lakhs total
    minMarks: 560,
    maxMarks: 620,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3",
    description: "Established medical college with strong clinical exposure and community health programs.",
    phone: "+91-821-2548400",
    email: "principal@jssuni.edu.in",
    website: "https://www.jssuni.edu.in",
    establishedYear: 1984,
    accreditation: "NMC Approved, NAAC A Grade",
    facilityType: "Private Deemed University",
    hostelAvailable: true,
    totalStudents: 1800,
    facultyCount: 150,
    studentsPerFaculty: 12,
    affiliatedUniversity: "JSS Academy of Higher Education & Research",
    recognizedBy: "NMC, UGC",
    rating: 4.2,
    reviewsCount: 0
  },
  {
    name: "KMC Mangalore (Kasturba Medical College)",
    location: "Mangalore, Karnataka",
    state: "Karnataka",
    address: "Light House Hill Road, Mangalore, Karnataka 575001",
    annualFee: 16e5,
    // ₹16 lakhs per year
    totalFee: 88e5,
    // ₹88 lakhs total
    minMarks: 590,
    maxMarks: 660,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3",
    description: "Part of Manipal Academy, known for clinical excellence and research opportunities.",
    phone: "+91-824-2445050",
    email: "principal.kmc@manipal.edu",
    website: "https://manipal.edu/kmc-mangalore.html",
    establishedYear: 1953,
    accreditation: "NAAC A+, NMC Approved",
    facilityType: "Private University",
    hostelAvailable: true,
    totalStudents: 2200,
    facultyCount: 170,
    studentsPerFaculty: 13,
    rating: 4.5,
    reviewsCount: 0
  },
  // Maharashtra Private Medical Colleges
  {
    name: "Dr. D.Y. Patil Medical College",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    address: "Sant Tukaram Nagar, Pimpri, Pune, Maharashtra 411018",
    annualFee: 17e5,
    // ₹17 lakhs per year
    totalFee: 935e4,
    // ₹93.5 lakhs total
    minMarks: 570,
    maxMarks: 640,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?ixlib=rb-4.0.3",
    description: "Premier medical college with state-of-the-art facilities and excellent clinical training.",
    phone: "+91-20-27803200",
    email: "admissions@dpu.edu.in",
    website: "https://dpu.edu.in/dmc",
    establishedYear: 1989,
    accreditation: "NAAC A, NMC Approved",
    facilityType: "Private Deemed University",
    hostelAvailable: true,
    totalStudents: 2e3,
    facultyCount: 160,
    studentsPerFaculty: 12,
    rating: 4.3,
    reviewsCount: 0
  },
  {
    name: "Bharati Vidyapeeth Medical College",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    address: "Pune Satara Road, Dhankawadi, Pune, Maharashtra 411043",
    annualFee: 14e5,
    // ₹14 lakhs per year
    totalFee: 77e5,
    // ₹77 lakhs total
    minMarks: 550,
    maxMarks: 610,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3",
    description: "Well-established medical college with comprehensive medical education and healthcare services.",
    phone: "+91-20-24373232",
    email: "principal.medical@bharatividyapeeth.edu",
    website: "https://www.bharatividyapeeth.edu",
    establishedYear: 1989,
    rating: 4.1,
    reviewsCount: 0
  },
  // Tamil Nadu Private Medical Colleges
  {
    name: "SRM Medical College Hospital & Research Centre",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    address: "SRM Nagar, Kattankulathur, Tamil Nadu 603203",
    annualFee: 225e4,
    // ₹22.5 lakhs per year (highest in deemed category)
    totalFee: 12375e3,
    // ₹1.24 crores total
    minMarks: 600,
    maxMarks: 680,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3",
    description: "Premier medical college with advanced research facilities and international collaborations.",
    phone: "+91-44-47433000",
    email: "admissions@srmist.edu.in",
    website: "https://www.srmist.edu.in",
    establishedYear: 1985,
    accreditation: "NAAC A++, NMC Approved",
    facilityType: "Private Deemed University",
    hostelAvailable: true,
    rating: 4.6,
    reviewsCount: 0
  },
  {
    name: "Saveetha Medical College",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    address: "Saveetha Nagar, Thandalam, Chennai, Tamil Nadu 602105",
    annualFee: 18e5,
    // ₹18 lakhs per year
    totalFee: 99e5,
    // ₹99 lakhs total
    minMarks: 580,
    maxMarks: 650,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3",
    description: "Modern medical college with focus on innovation in medical education and patient care.",
    phone: "+91-44-66726500",
    email: "info@saveetha.ac.in",
    website: "https://www.saveetha.ac.in",
    establishedYear: 2005,
    rating: 4.2,
    reviewsCount: 0
  },
  // Rajasthan Private Medical Colleges
  {
    name: "National Institute of Medical Sciences",
    location: "Jaipur, Rajasthan",
    state: "Rajasthan",
    address: "NIMS Campus, Shobha Nagar, Jaipur, Rajasthan 302017",
    annualFee: 1795e3,
    // ₹17.95 lakhs per year (highest in Rajasthan)
    totalFee: 9872500,
    // ₹98.7 lakhs total
    minMarks: 560,
    maxMarks: 630,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3",
    description: "Leading medical college in Rajasthan with comprehensive healthcare facilities.",
    phone: "+91-141-2596200",
    email: "info@nimsuniversity.org",
    website: "https://www.nimsuniversity.org",
    establishedYear: 2008,
    rating: 4,
    reviewsCount: 0
  },
  // Kerala Private Medical Colleges
  {
    name: "Amrita Institute of Medical Sciences",
    location: "Kochi, Kerala",
    state: "Kerala",
    address: "AIMS Ponekkara P.O., Kochi, Kerala 682041",
    annualFee: 15e5,
    // ₹15 lakhs per year
    totalFee: 825e4,
    // ₹82.5 lakhs total
    minMarks: 590,
    maxMarks: 670,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?ixlib=rb-4.0.3",
    description: "Top-tier medical college with strong research focus and international recognition.",
    phone: "+91-484-2851234",
    email: "aims@aims.amrita.edu",
    website: "https://www.amrita.edu/aims",
    establishedYear: 1998,
    accreditation: "NAAC A++, NMC Approved",
    facilityType: "Private Deemed University",
    rating: 4.7,
    reviewsCount: 0
  },
  // Delhi Private Medical Colleges
  {
    name: "Jamia Hamdard Medical College",
    location: "New Delhi, Delhi",
    state: "Delhi",
    address: "Hamdard Nagar, New Delhi 110062",
    annualFee: 13e5,
    // ₹13 lakhs per year
    totalFee: 715e4,
    // ₹71.5 lakhs total
    minMarks: 580,
    maxMarks: 650,
    category: "MBBS",
    imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3",
    description: "Established medical college with focus on Unani and modern medicine integration.",
    phone: "+91-11-26059688",
    email: "registrar@jamiahamdard.edu",
    website: "https://www.jamiahamdard.edu",
    establishedYear: 1989,
    rating: 4.1,
    reviewsCount: 0
  },
  // MDMS/Postgraduate Colleges
  {
    name: "Sri Ramachandra Medical College - MD/MS Programs",
    location: "Chennai, Tamil Nadu",
    state: "Tamil Nadu",
    address: "No.1, Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116",
    annualFee: 35e5,
    // ₹35 lakhs per year for MD/MS
    totalFee: 105e5,
    // ₹1.05 crores total (3 years)
    minMarks: 350,
    // NEET PG cutoff
    maxMarks: 500,
    category: "MDMS",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3",
    description: "Premier postgraduate medical education with specializations in all major branches.",
    phone: "+91-44-45928900",
    email: "pgadmissions@sriramachandra.edu.in",
    website: "https://www.sriramachandra.edu.in",
    establishedYear: 1985,
    rating: 4.4,
    reviewsCount: 0
  },
  {
    name: "MS Orthopedics - Manipal College",
    location: "Manipal, Karnataka",
    state: "Karnataka",
    address: "Tiger Circle Road, Madhav Nagar, Manipal, Karnataka 576104",
    annualFee: 42e5,
    // ₹42 lakhs per year for MS Orthopedics
    totalFee: 126e5,
    // ₹1.26 crores total
    minMarks: 380,
    maxMarks: 520,
    category: "MDMS",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3",
    description: "Specialized MS Orthopedics program with advanced surgical training and research opportunities.",
    phone: "+91-820-2922327",
    email: "pgadmissions@manipal.edu",
    website: "https://manipal.edu/mcoms.html",
    establishedYear: 1953,
    rating: 4.5,
    reviewsCount: 0
  },
  {
    name: "MD Pediatrics - JSS Medical College",
    location: "Mysore, Karnataka",
    state: "Karnataka",
    address: "SS Nagara, Mysuru, Karnataka 570015",
    annualFee: 28e5,
    // ₹28 lakhs per year
    totalFee: 84e5,
    // ₹84 lakhs total
    minMarks: 360,
    maxMarks: 480,
    category: "MDMS",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3",
    description: "Comprehensive MD Pediatrics program with excellent clinical exposure in child healthcare.",
    phone: "+91-821-2548400",
    email: "pgadmissions@jssuni.edu.in",
    website: "https://www.jssuni.edu.in",
    establishedYear: 1984,
    rating: 4.3,
    reviewsCount: 0
  },
  {
    name: "MD General Medicine - Dr. D.Y. Patil Medical College",
    location: "Pune, Maharashtra",
    state: "Maharashtra",
    address: "Sant Tukaram Nagar, Pimpri, Pune, Maharashtra 411018",
    annualFee: 32e5,
    // ₹32 lakhs per year
    totalFee: 96e5,
    // ₹96 lakhs total
    minMarks: 370,
    maxMarks: 500,
    category: "MDMS",
    imageUrl: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?ixlib=rb-4.0.3",
    description: "Advanced MD General Medicine program with focus on clinical research and patient care.",
    phone: "+91-20-27803200",
    email: "pgadmissions@dpu.edu.in",
    website: "https://dpu.edu.in/dmc",
    establishedYear: 1989,
    rating: 4.2,
    reviewsCount: 0
  }
];
async function importPrivateMedicalCollegesData() {
  console.log("Starting import of private medical colleges data...");
  try {
    let importedCount = 0;
    let errorCount = 0;
    for (const college of privateMedicalColleges) {
      try {
        const existingColleges = await storage.getAllColleges();
        const exists = existingColleges.find(
          (c) => c.name.toLowerCase() === college.name.toLowerCase() && c.location.toLowerCase() === college.location.toLowerCase()
        );
        if (!exists) {
          await storage.createCollege(college);
          importedCount++;
          console.log(`\u2713 Imported: ${college.name} (${college.category})`);
        } else {
          console.log(`- Skipped: ${college.name} (already exists)`);
        }
      } catch (error) {
        console.error(`\u2717 Error importing ${college.name}:`, error);
        errorCount++;
      }
    }
    console.log(`
=== Import Summary ===`);
    console.log(`\u2713 Successfully imported: ${importedCount} colleges`);
    console.log(`- Skipped (already exist): ${privateMedicalColleges.length - importedCount - errorCount}`);
    if (errorCount > 0) {
      console.log(`\u2717 Errors: ${errorCount} colleges`);
    }
    console.log(`Total colleges processed: ${privateMedicalColleges.length}`);
    return {
      success: true,
      imported: importedCount,
      skipped: privateMedicalColleges.length - importedCount - errorCount,
      errors: errorCount,
      total: privateMedicalColleges.length
    };
  } catch (error) {
    console.error("Import failed:", error);
    return {
      success: false,
      error: error.message,
      imported: 0,
      skipped: 0,
      errors: privateMedicalColleges.length,
      total: privateMedicalColleges.length
    };
  }
}

// server/routes.ts
import { z as z2 } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/colleges", async (req, res) => {
    try {
      const colleges2 = await storage.getAllColleges();
      res.json(colleges2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch colleges" });
    }
  });
  app2.post("/api/colleges/filter", async (req, res) => {
    try {
      const criteria = filterCollegeSchema.parse(req.body);
      const filteredColleges = await storage.filterColleges(criteria);
      res.json(filteredColleges);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid filter criteria", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to filter colleges" });
      }
    }
  });
  app2.post("/api/colleges", async (req, res) => {
    try {
      const collegeData = insertCollegeSchema.parse(req.body);
      const newCollege = await storage.createCollege(collegeData);
      res.status(201).json(newCollege);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid college data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create college" });
      }
    }
  });
  app2.put("/api/colleges/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertCollegeSchema.partial().parse(req.body);
      const updatedCollege = await storage.updateCollege(id, updates);
      if (!updatedCollege) {
        res.status(404).json({ message: "College not found" });
        return;
      }
      res.json(updatedCollege);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid college data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update college" });
      }
    }
  });
  app2.delete("/api/colleges/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCollege(id);
      if (!deleted) {
        res.status(404).json({ message: "College not found" });
        return;
      }
      res.json({ message: "College deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete college" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin || admin.password !== password) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const colleges2 = await storage.getAllColleges();
      const stats = {
        totalColleges: colleges2.length,
        searchesToday: Math.floor(Math.random() * 500),
        // Mock data for demo
        activeUsers: Math.floor(Math.random() * 100),
        newThisMonth: Math.floor(Math.random() * 50)
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/admin/export-student-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllStudentInquiries();
      const csvHeaders = [
        "Student Name",
        "Email",
        "Phone Number",
        "Budget Range",
        "Preferred State",
        "NEET Score",
        "Submission Date"
      ].join(",");
      const csvRows = inquiries.map((inquiry) => {
        const formatBudget = (budget) => {
          if (budget.includes("+")) {
            const base = budget.replace("+", "");
            const amount = parseInt(base);
            return `\u20B9${(amount / 1e5).toFixed(1)} Lakhs+`;
          }
          const [min, max] = budget.split("-").map(Number);
          if (max) {
            return `\u20B9${(min / 1e5).toFixed(1)} - \u20B9${(max / 1e5).toFixed(1)} Lakhs`;
          }
          return budget;
        };
        return [
          `"${inquiry.studentName}"`,
          `"${inquiry.email}"`,
          `"${inquiry.phoneNumber}"`,
          `"${formatBudget(inquiry.budget)}"`,
          `"${inquiry.state}"`,
          `"${inquiry.marks}"`,
          `"${inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : "N/A"}"`
        ].join(",");
      });
      const csvContent = [csvHeaders, ...csvRows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="student-inquiries-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`);
      res.send(csvContent);
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ message: "Failed to export student inquiries" });
    }
  });
  app2.get("/api/settings", async (req, res) => {
    try {
      const settings2 = await storage.getSettings();
      res.json(settings2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });
  app2.put("/api/settings", async (req, res) => {
    try {
      const settingsData = insertSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateSettings(settingsData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });
  app2.post("/api/admin/change-password", async (req, res) => {
    try {
      const { username } = req.body;
      const passwordData = changePasswordSchema.parse(req.body);
      if (!username) {
        res.status(400).json({ message: "Username is required" });
        return;
      }
      const success = await storage.changeAdminPassword(username, passwordData);
      if (!success) {
        res.status(400).json({ message: "Current password is incorrect" });
        return;
      }
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid password data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to change password" });
      }
    }
  });
  app2.post("/api/student-inquiries", async (req, res) => {
    try {
      const inquiryData = insertStudentInquirySchema.parse(req.body);
      const newInquiry = await storage.createStudentInquiry(inquiryData);
      res.status(201).json(newInquiry);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid inquiry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create inquiry" });
      }
    }
  });
  app2.get("/api/admin/student-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getAllStudentInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student inquiries" });
    }
  });
  app2.get("/api/colleges/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const reviews2 = await storage.getCollegeReviews(id);
      res.json(reviews2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });
  app2.post("/api/colleges/:id/reviews", async (req, res) => {
    try {
      const { id } = req.params;
      const reviewData = insertReviewSchema.parse({ ...req.body, collegeId: id });
      const newReview = await storage.addReview(reviewData);
      await storage.logAnalytics({
        eventType: "review",
        collegeId: id,
        studentEmail: reviewData.email,
        metadata: { rating: reviewData.rating }
      });
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid review data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });
  app2.get("/api/applications", async (req, res) => {
    try {
      const applications2 = await storage.getApplications();
      res.json(applications2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  app2.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const newApplication = await storage.addApplication(applicationData);
      await storage.logAnalytics({
        eventType: "application",
        collegeId: applicationData.collegeId,
        studentEmail: applicationData.email,
        metadata: { neetScore: applicationData.neetScore }
      });
      res.status(201).json(newApplication);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid application data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create application" });
      }
    }
  });
  app2.put("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedApplication = await storage.updateApplication(id, updates);
      if (!updatedApplication) {
        res.status(404).json({ message: "Application not found" });
        return;
      }
      res.json(updatedApplication);
    } catch (error) {
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  app2.get("/api/scholarships", async (req, res) => {
    try {
      const { collegeId } = req.query;
      const scholarships2 = await storage.getScholarships(collegeId);
      res.json(scholarships2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scholarships" });
    }
  });
  app2.post("/api/scholarships", async (req, res) => {
    try {
      const scholarshipData = insertScholarshipSchema.parse(req.body);
      const newScholarship = await storage.addScholarship(scholarshipData);
      res.status(201).json(newScholarship);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid scholarship data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create scholarship" });
      }
    }
  });
  app2.get("/api/favorites/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const favorites2 = await storage.getFavorites(email);
      res.json(favorites2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });
  app2.post("/api/favorites", async (req, res) => {
    try {
      const { studentEmail, collegeId } = req.body;
      const newFavorite = await storage.addFavorite(studentEmail, collegeId);
      await storage.logAnalytics({
        eventType: "favorite",
        collegeId,
        studentEmail,
        metadata: { action: "add" }
      });
      res.status(201).json(newFavorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  app2.delete("/api/favorites", async (req, res) => {
    try {
      const { studentEmail, collegeId } = req.body;
      const removed = await storage.removeFavorite(studentEmail, collegeId);
      if (!removed) {
        res.status(404).json({ message: "Favorite not found" });
        return;
      }
      await storage.logAnalytics({
        eventType: "favorite",
        collegeId,
        studentEmail,
        metadata: { action: "remove" }
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });
  app2.post("/api/comparisons", async (req, res) => {
    try {
      const { studentEmail, collegeIds } = req.body;
      const colleges2 = await Promise.all(
        collegeIds.map((id) => storage.getCollegeById(id))
      );
      const comparisonData = {
        colleges: colleges2.filter(Boolean),
        comparedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const newComparison = await storage.saveComparison(studentEmail, collegeIds, comparisonData);
      await storage.logAnalytics({
        eventType: "comparison",
        studentEmail,
        metadata: { collegeIds, count: collegeIds.length }
      });
      res.status(201).json(newComparison);
    } catch (error) {
      res.status(500).json({ message: "Failed to save comparison" });
    }
  });
  app2.get("/api/comparisons/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const comparisons2 = await storage.getComparisons(email);
      res.json(comparisons2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comparisons" });
    }
  });
  app2.get("/api/analytics", async (req, res) => {
    try {
      const { eventType, startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : void 0;
      const end = endDate ? new Date(endDate) : void 0;
      const analytics2 = await storage.getAnalytics(eventType, start, end);
      res.json(analytics2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  app2.post("/api/analytics", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      const newAnalytics = await storage.logAnalytics(analyticsData);
      res.status(201).json(newAnalytics);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to log analytics" });
      }
    }
  });
  app2.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const thirtyDaysAgo = /* @__PURE__ */ new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const [
        totalInquiries,
        recentApplications,
        pageViews,
        popularColleges
      ] = await Promise.all([
        storage.getAllStudentInquiries(),
        storage.getAnalytics("application", thirtyDaysAgo),
        storage.getAnalytics("page_view", thirtyDaysAgo),
        storage.getAnalytics("search", thirtyDaysAgo)
      ]);
      const collegeViews = popularColleges.reduce((acc, analytic) => {
        if (analytic.collegeId) {
          acc[analytic.collegeId] = (acc[analytic.collegeId] || 0) + 1;
        }
        return acc;
      }, {});
      const popularCollegesList = Object.entries(collegeViews).sort(([, a], [, b]) => b - a).slice(0, 5).map(([collegeId]) => collegeId);
      res.json({
        totalInquiries: totalInquiries.length,
        recentApplications: recentApplications.length,
        pageViews: pageViews.length,
        popularColleges: popularCollegesList,
        inquiriesGrowth: totalInquiries.filter(
          (i) => i.createdAt && new Date(i.createdAt) >= thirtyDaysAgo
        ).length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard analytics" });
    }
  });
  app2.get("/api/admin/analytics/dashboard-enhanced", async (req, res) => {
    try {
      const timeframe = req.query.timeframe || "week";
      const dashboardData = await storage.getDashboardAnalytics(timeframe);
      res.json(dashboardData);
    } catch (error) {
      console.error("Dashboard analytics error:", error);
      res.status(500).json({ message: "Failed to fetch enhanced dashboard analytics" });
    }
  });
  app2.get("/api/admin/analytics/college/:collegeId", async (req, res) => {
    try {
      const { collegeId } = req.params;
      const collegeAnalytics = await storage.getCollegeAnalytics(collegeId);
      res.json(collegeAnalytics);
    } catch (error) {
      console.error("College analytics error:", error);
      res.status(500).json({ message: "Failed to fetch college analytics" });
    }
  });
  app2.get("/api/admin/analytics/reports/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const timeframe = req.query.timeframe || "month";
      const reportData = await storage.getDetailedReports(type, timeframe);
      res.json(reportData);
    } catch (error) {
      console.error("Detailed reports error:", error);
      res.status(500).json({ message: "Failed to fetch detailed reports" });
    }
  });
  app2.post("/api/analytics/track", async (req, res) => {
    try {
      const analyticsData = insertAnalyticsSchema.parse(req.body);
      await storage.logAnalytics(analyticsData);
      res.status(200).json({ message: "Analytics event tracked successfully" });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      } else {
        console.error("Analytics tracking error:", error);
        res.status(500).json({ message: "Failed to track analytics event" });
      }
    }
  });
  app2.get("/api/admin/analytics/export", async (req, res) => {
    try {
      const type = req.query.type || "summary";
      const timeframe = req.query.timeframe || "month";
      let exportData = {};
      switch (type) {
        case "dashboard":
          exportData = await storage.getDashboardAnalytics(timeframe);
          break;
        case "user_behavior":
          exportData = await storage.getDetailedReports("user_behavior", timeframe);
          break;
        case "conversion_funnel":
          exportData = await storage.getDetailedReports("conversion_funnel", timeframe);
          break;
        case "geographic":
          exportData = await storage.getDetailedReports("geographic_distribution", timeframe);
          break;
        case "college_performance":
          exportData = await storage.getDetailedReports("college_performance", timeframe);
          break;
        default:
          exportData = await storage.getDashboardAnalytics(timeframe);
      }
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="analytics-${type}-${timeframe}-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error("Analytics export error:", error);
      res.status(500).json({ message: "Failed to export analytics data" });
    }
  });
  app2.post("/api/admin/import-colleges", async (req, res) => {
    try {
      console.log("Starting private medical colleges data import...");
      const result = await importPrivateMedicalCollegesData();
      if (result.success) {
        res.json({
          message: "Data import completed successfully",
          ...result
        });
      } else {
        res.status(500).json({
          message: "Data import failed",
          error: result.error,
          ...result
        });
      }
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({
        message: "Failed to import college data",
        error: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
