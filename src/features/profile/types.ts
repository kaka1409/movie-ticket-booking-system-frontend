/** Editable profile fields. `fullname` is the wire name of `User.name`. */
export interface UpdateProfileRequest {
  fullname?: string;
  phone?: string;
  dob?: string;
}
