-- Prevent duplicate entries for same user + date + category
-- Enables upsert on import
ALTER TABLE wealth_data
  ADD CONSTRAINT wealth_data_unique_date_category
  UNIQUE (user_id, date, category);
