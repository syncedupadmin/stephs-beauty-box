-- Add beauty services for Steph's Beauty Box
INSERT INTO services (name, description, duration_minutes, price_cents, position, is_active) VALUES
('Classic Lash Extensions', 'Full set of classic lash extensions for a natural, elegant look.', 90, 15000, 1, true),
('Volume Lash Extensions', 'Full set of volume lashes for a dramatic, full look.', 120, 20000, 2, true),
('Lash Fill', 'Maintenance fill for existing lash extensions (2-3 weeks).', 60, 7500, 3, true),
('Brow Lamination', 'Reshape and set brows for a fuller, fluffier look.', 45, 6500, 4, true),
('Brow Tint', 'Semi-permanent brow coloring for defined brows.', 30, 3500, 5, true),
('Lip Blush', 'Semi-permanent lip color for a natural, enhanced look.', 120, 35000, 6, true),
('Facial Treatment', 'Customized facial treatment for your skin type.', 60, 8500, 7, true),
('Makeup Application', 'Professional makeup for any occasion.', 60, 7500, 8, true)
ON CONFLICT DO NOTHING;
