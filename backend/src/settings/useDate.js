const useDate = ({ settings }) => {
  const { preevol_techinite_app_date_format } = settings;

  const dateFormat = preevol_techinite_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
