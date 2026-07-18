/**
 * Pure, dependency-free field readers shared by the identity matchers.
 *
 * Matchers receive Directus items and Twenty candidates as loosely-typed
 * `Record<string, unknown>` so they stay decoupled from ORM internals.  These
 * helpers normalize the common shapes encountered in the migration data:
 *
 *  - Directus items use snake_case keys (`first_name`, `ats_uuid`, ...).
 *  - Twenty `person.emails` is `{ primaryEmail, additionalEmails }`.
 *  - Twenty `person.name` is `{ firstName, lastName }`.
 *  - Twenty `company.domainName` is a `LinksMetadata` link object.
 *  - Each Twenty candidate may carry an attached `externalLinks` array (the
 *    authoritative link rows for that record) so matchers can do `ats_uuid`
 *    matching without any I/O.
 */

/** A flattened view of an attached `externalEntityLink` row. */
export interface AttachedExternalLink {
  twentyEntityName?: string | null;
  twentyRecordId?: string | null;
  externalRecordId?: string | null;
  externalSystemName?: string | null;
  externalEntityName?: string | null;
  externalNaturalKey?: string | null;
  isAuthoritativeLink?: boolean | null;
}

/** The first defined, non-empty, trimmed string among the given object keys. */
export function readStringField(
  record: Record<string, unknown> | null | undefined,
  keys: readonly string[],
): string | undefined {
  if (!record) {
    return undefined;
  }

  for (const key of keys) {
    const raw = record[key];

    if (raw == null) {
      continue;
    }

    const value = Array.isArray(raw) ? raw[0] : raw;
    const str = value == null ? '' : value.toString().trim();

    if (str !== '') {
      return str;
    }
  }

  return undefined;
}

/**
 * Read the external record id from a Directus item.
 *
 * Prefers `ats_uuid` (the authoritative cross-system key per the collection
 * map) and falls back to the item's primary `id`.
 */
export function readDirectusExternalId(
  item: Record<string, unknown>,
): string | undefined {
  const atsUuid = readStringField(item, ['ats_uuid', 'atsUuid', 'ats_id']);

  if (atsUuid) {
    return atsUuid;
  }

  return readStringField(item, ['id', 'uuid']);
}

/** Read a list of emails from a Directus executive/person item. */
export function readDirectusEmails(
  item: Record<string, unknown>,
): string[] {
  const collected: string[] = [];

  const primary = readStringField(item, [
    'email',
    'email_address',
    'emailAddress',
    'primary_email',
    'primaryEmail',
  ]);

  if (primary) {
    collected.push(primary);
  }

  const list = item['emails'];

  if (Array.isArray(list)) {
    for (const entry of list) {
      if (typeof entry === 'string' && entry.trim() !== '') {
        collected.push(entry.trim());
      } else if (entry != null && typeof entry === 'object') {
        const addr = (entry as Record<string, unknown>).primaryEmail;
        if (typeof addr === 'string' && addr.trim() !== '') {
          collected.push(addr.trim());
        }
      }
    }
  }

  return Array.from(new Set(collected.map((e) => e.toLowerCase())));
}

/** Read phone-like fields from a Directus item. */
export function readDirectusPhones(
  item: Record<string, unknown>,
): string[] {
  const keys = [
    'phone',
    'phone_number',
    'phoneNumber',
    'mobile',
    'mobile_phone',
    'mobilePhone',
  ];
  const collected: string[] = [];

  for (const key of keys) {
    const value = item[key];

    if (typeof value === 'string' && value.trim() !== '') {
      collected.push(value.trim());
    }
  }

  // Normalize to digits so comparisons are format-agnostic.
  return Array.from(new Set(collected.map((p) => p.replace(/[^\d+]/g, ''))));
}

/** Read first/last/display name fields from a Directus item. */
export function readDirectusName(
  item: Record<string, unknown>,
): { firstName: string; lastName: string; full: string } {
  const firstName = readStringField(item, [
    'first_name',
    'firstName',
    'given_name',
    'givenName',
  ]);
  const lastName = readStringField(item, [
    'last_name',
    'lastName',
    'family_name',
    'familyName',
    'surname',
  ]);
  const fullName = readStringField(item, [
    'name',
    'full_name',
    'fullName',
    'display_name',
    'displayName',
  ]);

  const full =
    fullName ??
    [firstName, lastName].filter((p): p is string => !!p).join(' ').trim();

  return {
    firstName: firstName ?? '',
    lastName: lastName ?? '',
    full,
  };
}

/** Read generic external/source id fields from a Directus item. */
export function readDirectusSourceIds(
  item: Record<string, unknown>,
): string[] {
  const keys = [
    'freshsales_id',
    'freshsalesId',
    'freshsales_contact_id',
    'freshsales_contactId',
    'source_id',
    'sourceId',
    'external_id',
    'externalId',
    'crm_id',
    'crmId',
  ];
  const collected: string[] = [];

  for (const key of keys) {
    const value = readStringField(item, [key]);

    if (value) {
      collected.push(value);
    }
  }

  return Array.from(new Set(collected));
}

/** Read domain/website fields from a Directus company item. */
export function readDirectusDomains(
  item: Record<string, unknown>,
): string[] {
  const raw = readStringField(item, [
    'domain',
    'domain_name',
    'domainName',
    'website',
    'website_url',
    'websiteUrl',
  ]);

  if (!raw) {
    return [];
  }

  return [normalizeDomain(raw)];
}

/**
 * Extract all email addresses from a Twenty `person` candidate
 * (`emails.primaryEmail` + `emails.additionalEmails`).
 */
export function readPersonEmails(
  candidate: Record<string, unknown>,
): string[] {
  const emails = candidate['emails'];
  const collected: string[] = [];

  if (emails != null && typeof emails === 'object') {
    const meta = emails as Record<string, unknown>;
    const primary = meta['primaryEmail'];
    if (typeof primary === 'string' && primary.trim() !== '') {
      collected.push(primary.trim().toLowerCase());
    }

    const additional = meta['additionalEmails'];
    if (Array.isArray(additional)) {
      for (const entry of additional) {
        if (typeof entry === 'string' && entry.trim() !== '') {
          collected.push(entry.trim().toLowerCase());
        }
      }
    }
  }

  // Some projections flatten emails to a string array.
  if (Array.isArray(emails)) {
    for (const entry of emails) {
      if (typeof entry === 'string' && entry.trim() !== '') {
        collected.push(entry.trim().toLowerCase());
      }
    }
  }

  return Array.from(new Set(collected));
}

/** Extract phone digits from a Twenty `person` candidate. */
export function readPersonPhones(
  candidate: Record<string, unknown>,
): string[] {
  const collected: string[] = [];

  const phones = candidate['phones'];

  if (phones != null && typeof phones === 'object') {
    const meta = phones as Record<string, unknown>;
    const primary = meta['primaryPhoneNumber'];
    if (typeof primary === 'string' && primary.trim() !== '') {
      collected.push(primary.replace(/[^\d+]/g, ''));
    }
    const additional = meta['additionalPhones'];
    if (Array.isArray(additional)) {
      for (const entry of additional) {
        if (entry != null && typeof entry === 'object') {
          const number = (entry as Record<string, unknown>).phoneNumber;
          if (typeof number === 'string' && number.trim() !== '') {
            collected.push(number.replace(/[^\d+]/g, ''));
          }
        } else if (typeof entry === 'string' && entry.trim() !== '') {
          collected.push(entry.replace(/[^\d+]/g, ''));
        }
      }
    }
  }

  const legacy = candidate['phone'];
  if (typeof legacy === 'string' && legacy.trim() !== '') {
    collected.push(legacy.replace(/[^\d+]/g, ''));
  }

  return Array.from(new Set(collected.filter((p) => p !== '')));
}

/** Extract first + last name from a Twenty `person` candidate. */
export function readPersonName(
  candidate: Record<string, unknown>,
): { firstName: string; lastName: string; full: string } {
  const name = candidate['name'];

  if (name != null && typeof name === 'object') {
    const meta = name as Record<string, unknown>;
    const firstName =
      typeof meta['firstName'] === 'string' ? meta['firstName'] : '';
    const lastName =
      typeof meta['lastName'] === 'string' ? meta['lastName'] : '';
    const full = [firstName, lastName].filter((p) => p !== '').join(' ').trim();

    return { firstName, lastName, full };
  }

  const fallback =
    typeof candidate['name'] === 'string'
      ? (candidate['name'] as string)
      : '';

  return { firstName: '', lastName: '', full: fallback };
}

/** Extract normalized domains from a Twenty `company` candidate. */
export function readCompanyDomains(
  candidate: Record<string, unknown>,
): string[] {
  const collected: string[] = [];

  const domainName = candidate['domainName'];

  if (domainName != null && typeof domainName === 'object') {
    const meta = domainName as Record<string, unknown>;
    const primary = meta['primaryLinkUrl'];
    if (typeof primary === 'string' && primary.trim() !== '') {
      collected.push(normalizeDomain(primary));
    }
    const secondary = meta['secondaryLinks'];
    if (Array.isArray(secondary)) {
      for (const link of secondary) {
        if (link != null && typeof link === 'object') {
          const url = (link as Record<string, unknown>).url;
          if (typeof url === 'string' && url.trim() !== '') {
            collected.push(normalizeDomain(url));
          }
        }
      }
    }
  } else if (typeof domainName === 'string' && domainName.trim() !== '') {
    collected.push(normalizeDomain(domainName));
  }

  return Array.from(new Set(collected.filter((d) => d !== '')));
}

/** Strip protocol/path from a URL or bare domain and lowercase it. */
export function normalizeDomain(value: string): string {
  return value
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
    .trim();
}

/** Read the attached external links from a Twenty candidate (if any). */
export function readCandidateExternalLinks(
  candidate: Record<string, unknown>,
): AttachedExternalLink[] {
  const links = candidate['externalLinks'];

  if (!Array.isArray(links)) {
    return [];
  }

  return links.filter(
    (link): link is AttachedExternalLink =>
      link != null && typeof link === 'object',
  );
}

/**
 * Collect the set of external record ids carried by a candidate's attached
 * links, optionally filtered to authoritative links only.
 */
export function readCandidateExternalIds(
  candidate: Record<string, unknown>,
  options?: { authoritativeOnly?: boolean },
): string[] {
  const links = readCandidateExternalLinks(candidate);
  const collected: string[] = [];

  for (const link of links) {
    if (options?.authoritativeOnly && !link.isAuthoritativeLink) {
      continue;
    }

    for (const value of [link.externalRecordId, link.externalNaturalKey]) {
      if (typeof value === 'string' && value.trim() !== '') {
        collected.push(value.trim());
      }
    }
  }

  return Array.from(new Set(collected));
}

/** Safely read the `id` of a Twenty candidate record. */
export function readCandidateId(
  candidate: Record<string, unknown>,
): string | undefined {
  return readStringField(candidate, ['id']);
}
