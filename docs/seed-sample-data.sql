-- Optional sample data. Run only on a disposable/prototype Supabase project.
insert into public.balance_entries (brand_name, entity_name, account_name, provider, account_code, category, balance, notes, display_order) values
('1001','CV Sepuluh Januari Sukses','OCBC Operasional 1001','OCBC','675','Bank',90793500,'Saldo dummy operasional',1),
('1001','CV Sepuluh Januari Sukses','Xendit 1001','Xendit','71001','Payment Gateway',18750000,'Saldo dummy operasional',2),
('Maison Y','Maison Y','BCA Maison PT','BCA','520','Bank',80125500,'Saldo dummy operasional',3),
('OMG','OMG Holding','BCA HO Jakarta','BCA','999','Bank',155230000,'Saldo dummy operasional',4);
insert into public.device_statuses (area, status, number, device, notes, display_order) values
('Online','OK','0811','Android POS','Aktif',1),
('Finance Hunian','Perlu cek','0812','iPhone Finance','Follow up harian',2);
