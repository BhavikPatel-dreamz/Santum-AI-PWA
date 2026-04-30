function normalizeTextValue(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function getFirstValue(profile, keys) {
  if (!profile || typeof profile !== "object") {
    return undefined;
  }

  for (const key of keys) {
    const value = profile[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      (!Array.isArray(value) || value.length > 0)
    ) {
      return value;
    }
  }

  return undefined;
}

function normalizeOptionList(values) {
  if (Array.isArray(values)) {
    return [
      ...new Set(
        values
          .flatMap((value) => {
            if (typeof value === "string") {
              return value.split(",");
            }

            if (value && typeof value === "object") {
              return [
                value.label,
                value.name,
                value.value,
                value.title,
                value.interest,
              ];
            }

            return [];
          })
          .map((value) => normalizeTextValue(value))
          .filter(Boolean),
      ),
    ];
  }

  if (typeof values === "string") {
    return [
      ...new Set(
        values
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }

  return [];
}

function formatDatePart(value) {
  return String(value).padStart(2, "0");
}

function formatDateToInputString(date) {
  return `${date.getFullYear()}-${formatDatePart(date.getMonth() + 1)}-${formatDatePart(
    date.getDate(),
  )}`;
}

export function formatProfileDobForInput(value) {
  const normalizedValue = normalizeTextValue(value);

  if (!normalizedValue) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(normalizedValue)) {
    return normalizedValue.slice(0, 10);
  }

  const slashDateMatch = normalizedValue.match(
    /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
  );

  if (slashDateMatch) {
    const [, day, month, year] = slashDateMatch;
    return `${year}-${formatDatePart(month)}-${formatDatePart(day)}`;
  }

  const parsedDate = new Date(normalizedValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return formatDateToInputString(parsedDate);
  }

  return "";
}

export function getProfileFirstName(profile) {
  return normalizeTextValue(
    getFirstValue(profile, ["first_name", "firstName", "firstname"]),
  );
}

export function getProfileLastName(profile) {
  return normalizeTextValue(
    getFirstValue(profile, ["last_name", "lastName", "lastname"]),
  );
}

export function getProfileFullName(profile) {
  const fullName = normalizeTextValue(
    getFirstValue(profile, ["name", "full_name", "display_name"]),
  );

  if (fullName) {
    return fullName;
  }

  return [getProfileFirstName(profile), getProfileLastName(profile)]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function getProfileEmail(profile) {
  return normalizeTextValue(
    getFirstValue(profile, ["email", "user_email", "mail"]),
  );
}

export function getProfileId(profile) {
  return normalizeTextValue(
    getFirstValue(profile, [
      "id",
      "_id",
      "ID",
      "user_id",
      "userId",
      "wp_user_id",
      "wpUserId",
      "customer_id",
      "customerId",
    ]),
  );
}

export function getProfilePhone(profile) {
  return normalizeTextValue(
    getFirstValue(profile, ["phone", "mobile", "user_phone", "phone_number"]),
  );
}

export function getProfileIdentityKey(profile) {
  
  const profileId = getProfileId(profile);

  if (profileId) {
    return `profile:${profileId}`;
  }

  const phone = getProfilePhone(profile);

  if (phone) {
    return `phone:${phone}`;
  }

  const email = getProfileEmail(profile);

  if (email) {
    return `email:${email.toLowerCase()}`;
  }

  return "";
}

export function getProfileDob(profile) {
  return formatProfileDobForInput(
    getFirstValue(profile, ["dob", "date_of_birth", "birth_date"]),
  );
}

export function getProfilePreferredLanguage(profile) {
  return normalizeTextValue(
    getFirstValue(profile, [
      "preferred_language",
      "preferredLanguage",
      "language",
    ]),
  );
}

export function getProfileInterests(profile) {
  return normalizeOptionList(
    getFirstValue(profile, [
      "area_of_interest",
      "area_of_interest[]",
      "interests",
      "interest",
      "topics",
    ]),
  );
}

export function buildProfileInitials(firstName, lastName) {
  const initials = [normalizeTextValue(firstName), normalizeTextValue(lastName)]
    .filter(Boolean)
    .map((value) => value.charAt(0).toUpperCase())
    .join("");

  if (initials) {
    return initials.slice(0, 2);
  }

  return "AM";
}
