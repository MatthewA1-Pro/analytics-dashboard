// Initialize the Supabase client
// Note: We removed the /rest/v1/ from the URL, as the SDK handles appending the correct paths.
// We also removed the accidental space from the ANON key.

const SUPABASE_URL = 'https://yyfiaivpjomqxeokzszy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZmlhaXZwam9tcXhlb2t6c3p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5ODI2MjEsImV4cCI6MjA5MzU1ODYyMX0._rpKPLoqmSvmyo1SdyTbWZ4U1PCplkVaRthTzg1ji1o';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
