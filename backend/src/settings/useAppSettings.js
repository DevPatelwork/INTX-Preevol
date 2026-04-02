const useAppSettings = () => {
  let settings = {};
  settings['preevol_techinite_app_email'] = 'noreply@preevoltechinite.com';
  settings['preevol_techinite_base_url'] = 'https://cloud.preevoltechinite.com';
  return settings;
};

module.exports = useAppSettings;
