-- Crear el bucket de storage para "evidence"
INSERT INTO storage.buckets (id, name, public) 
VALUES ('evidence', 'evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir a cualquiera leer los archivos de evidencia (ya que es público)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'evidence' );

-- Política para permitir a los usuarios autenticados subir archivos de evidencia
CREATE POLICY "Authenticated users can upload evidence" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'evidence' 
);

-- Política para permitir a los usuarios autenticados actualizar sus archivos
CREATE POLICY "Users can update their evidence"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'evidence'
);

-- Política para permitir a los usuarios autenticados borrar archivos
CREATE POLICY "Users can delete their evidence"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'evidence'
);
