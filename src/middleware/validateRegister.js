import Joi from "joi";

export const validateRegister = (schema) => {
  return (request, h) => {
    const { error } = schema.validate(request.payload, { abortEarly: false });
    if (error) {
      // Kelompokkan pesan kesalahan berdasarkan field
      const errorMessage = error.details.reduce((acc, err) => {
        const field = err.path[0]; // Mendapatkan nama field yang bermasalah
        if (!acc[field]) {
          acc[field] = []; // Buat array baru untuk field jika belum ada
        }
        acc[field].push(err.message); // Tambahkan pesan ke array field
        return acc;
      }, {});

      return h.response({ 
        status: 'fail',
        message:{errors: errorMessage },
        data:null
      }).code(400).takeover();
    }
    return h.continue;
  };
};



export const registerSchema = Joi.object({
  nama: Joi.string().example("string")
    .pattern(/^[A-Za-z\s]+$/, { name: 'letters and spaces' })
    .min(3)
    .required()
    .messages({
      'string.empty': 'Nama tidak boleh kosong',
      'string.min': 'Nama harus minimal 3 karakter',
      'string.pattern.name': 'Nama hanya boleh berisi huruf dan spasi',
    }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email tidak boleh kosong',
    'string.email': 'Email harus dalam format yang valid',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password harus minimal 6 karakter',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).example("string").required().messages({
    'string.empty': 'Konfirmasi password tidak boleh kosong',
    'any.only': 'Konfirmasi password harus sama dengan password',
  }),
});
