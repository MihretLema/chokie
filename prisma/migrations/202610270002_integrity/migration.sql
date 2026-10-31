CREATE UNIQUE INDEX "User_email_case_insensitive" ON "User" (lower("email"));
ALTER TABLE "Partner" ADD CONSTRAINT "partner_publication_approval" CHECK ("status" <> 'PUBLISHED' OR ("approvedAt" IS NOT NULL AND "verifiedAt" IS NOT NULL));
ALTER TABLE "Client" ADD CONSTRAINT "client_publication_approval" CHECK ("status" <> 'PUBLISHED' OR "approvedAt" IS NOT NULL);
ALTER TABLE "Testimonial" ADD CONSTRAINT "testimonial_publication_approval" CHECK ("status" <> 'PUBLISHED' OR "approvedAt" IS NOT NULL);
ALTER TABLE "CaseStudy" ADD CONSTRAINT "case_publication_approval" CHECK ("status" <> 'PUBLISHED' OR "approvedAt" IS NOT NULL);
ALTER TABLE "TrainingProgram" ADD CONSTRAINT "training_date_order" CHECK ("registrationDeadline" IS NULL OR "startDate" IS NULL OR "registrationDeadline" <= "startDate");
ALTER TABLE "InternalNote" ADD CONSTRAINT "note_one_parent" CHECK (num_nonnulls("inquiryId","consultationId","trainingInquiryId","ticketId") = 1);
ALTER TABLE "ServiceRelation" ADD CONSTRAINT "service_not_self_related" CHECK ("serviceId" <> "relatedId");
ALTER TABLE "MediaAsset" ADD CONSTRAINT "media_positive_size" CHECK ("byteSize" > 0 AND "byteSize" <= 5242880);
ALTER TABLE "Service" ADD CONSTRAINT "service_display_order" CHECK ("displayOrder" >= 0);
ALTER TABLE "Solution" ADD CONSTRAINT "solution_display_order" CHECK ("displayOrder" >= 0);
ALTER TABLE "PageSection" ADD CONSTRAINT "section_display_order" CHECK ("displayOrder" >= 0);
CREATE FUNCTION prevent_audit_mutation() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'Audit records are append-only'; END;
$$;
CREATE TRIGGER "audit_immutable" BEFORE UPDATE OR DELETE ON "AuditLog" FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();
CREATE FUNCTION enforce_private_ticket_attachment() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM "MediaAsset" WHERE "id"=NEW."mediaId" AND "visibility"='PRIVATE' AND "status"='READY' AND "deletedAt" IS NULL)
 THEN RAISE EXCEPTION 'Ticket attachments must be ready private assets'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER "ticket_attachment_private" BEFORE INSERT OR UPDATE ON "TicketAttachment" FOR EACH ROW EXECUTE FUNCTION enforce_private_ticket_attachment();
CREATE FUNCTION prevent_attachment_publication() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."visibility"='PUBLIC' AND EXISTS (SELECT 1 FROM "TicketAttachment" WHERE "mediaId"=NEW."id")
 THEN RAISE EXCEPTION 'Ticket attachments cannot become public'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER "attachment_never_public" BEFORE UPDATE ON "MediaAsset" FOR EACH ROW EXECUTE FUNCTION prevent_attachment_publication();
CREATE FUNCTION enforce_approved_client_reference() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
 IF NEW."status"='PUBLISHED' AND NEW."clientId" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "Client" WHERE "id"=NEW."clientId" AND "status"='PUBLISHED' AND "approvedAt" IS NOT NULL AND "deletedAt" IS NULL)
 THEN RAISE EXCEPTION 'Public customer content requires an approved published client'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER "testimonial_client_approved" BEFORE INSERT OR UPDATE ON "Testimonial" FOR EACH ROW EXECUTE FUNCTION enforce_approved_client_reference();
CREATE TRIGGER "case_client_approved" BEFORE INSERT OR UPDATE ON "CaseStudy" FOR EACH ROW EXECUTE FUNCTION enforce_approved_client_reference();
