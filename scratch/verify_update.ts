import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irouregsafylipfekfqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3VyZWdzYWZ5bGlwZmVrZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDAwMDEsImV4cCI6MjEwMzc3NjAwMX0.ZFkowY5Hwlq69PnQiOeBSufNEkatDAdJZtM3CQ9J-qs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log("Verificando update...");
  
  // Update iPhone 15 Plus (m53) price
  const testId = 'm53';
  const newPrice = 3300.55;
  
  const { data: updateData, error: updateError } = await supabase
    .from('iphone_models')
    .update({ valor_base_upgrade: newPrice })
    .eq('id', testId)
    .select();
    
  if (updateError) {
    console.error("Erro no update:", updateError);
    return;
  }
  
  console.log("Update sucesso:", updateData);
  
  // Re-fetch to ensure it stuck
  const { data: fetchResult, error: fetchError } = await supabase
    .from('iphone_models')
    .select('valor_base_upgrade')
    .eq('id', testId)
    .single();
    
  if (fetchError) {
    console.error("Erro no fetch:", fetchError);
    return;
  }
  
  console.log("Fetch confirmou persistência:", fetchResult);
}

verify();
