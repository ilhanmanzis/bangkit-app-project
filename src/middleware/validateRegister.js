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

      return h.response({ message: errorMessage }).code(400).takeover();
    }
    return h.continue;
  };
};



export const registerSchema = Joi.object({
  nama: Joi.string()
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
  jenisKelamin: Joi.string()
    .valid('Laki-laki', 'Perempuan')
    .required()
    .messages({
      'string.empty': 'Jenis kelamin tidak boleh kosong',
      'any.only': 'Jenis kelamin harus Laki-laki atau Perempuan',
    }),
  tanggalLahir: Joi.date().required()
  .iso() // Validasi ISO 8601 (YYYY-MM-DD)
  .less('now') // Tanggal harus sebelum hari ini
  .messages({
      'date.base': 'Tanggal lahir harus dalam format tanggal yang valid',
      'any.required': 'Tanggal lahir tidak boleh kosong',
      'date.iso': 'Tanggal lahir harus dalam format YYYY-MM-DD.',
      'date.less': 'Tanggal lahir harus sebelum hari ini.',
  }),
  beratBadan: Joi.number().positive().required().messages({
    'number.base': 'Berat badan harus berupa angka',
    'number.positive': 'Berat badan harus lebih dari 0',
    'any.required': 'Berat badan tidak boleh kosong',
  }),
  tinggiBadan: Joi.number().positive().required().messages({
    'number.base': 'Tinggi badan harus berupa angka',
    'number.positive': 'Tinggi badan harus lebih dari 0',
    'any.required': 'Tinggi badan tidak boleh kosong',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'string.min': 'Password harus minimal 6 karakter',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'Konfirmasi password tidak boleh kosong',
    'any.only': 'Konfirmasi password harus sama dengan password',
  }),
});
