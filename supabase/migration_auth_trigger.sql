-- ============================================
-- Trigger : sync auth.users → public.users
-- ============================================
-- Quand un user s'inscrit via Supabase Auth, on crée
-- automatiquement une ligne correspondante dans public.users
-- pour que les foreign keys fonctionnent.

-- Fonction trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, academy, subject, school_level)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'academy',
    CASE
      WHEN NEW.raw_user_meta_data->>'subject' IS NOT NULL
      THEN ARRAY[NEW.raw_user_meta_data->>'subject']
      ELSE NULL
    END,
    CASE
      WHEN NEW.raw_user_meta_data->>'school_level' IS NOT NULL
      THEN ARRAY[NEW.raw_user_meta_data->>'school_level']
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO NOTHING;  -- Si user existe déjà, on ne fait rien

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger : après chaque insert dans auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Pour les users existants (déjà inscrits avant le trigger)
-- On copie les users depuis auth.users vers public.users
-- ============================================
INSERT INTO public.users (id, email, full_name)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name'
FROM auth.users au
ON CONFLICT (id) DO NOTHING;

-- Vérification : affiche les users créés
SELECT id, email, full_name, created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;