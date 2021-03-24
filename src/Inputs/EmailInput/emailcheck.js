/*
 * Mailcheck https://github.com/mailcheck/mailcheck
 * Author
 * Derrick Ko (@derrickko)
 *
 * Released under the MIT License.
 *
 * v 1.1.0
 */

export default class Emailcheck {
  domainThreshold = 4;

  topLevelThreshold = 3;

  defaultDomains = [
    'yahoo.com',
    'google.com',
    'hotmail.com',
    'hotmail.co.uk',
    'gmail.com',
    'me.com',
    'aol.com',
    'mac.com',
    'live.com',
    'live.co.uk',
    'live.nl',
    'bigpound.com',
    'bigpond.net.au',
    'comcast.net',
    'googlemail.com',
    'comcast.net',
    'yahoo.co.uk',
    'yahoo.de',
    'msn.com',
    't-online.de',
    'hetnet.nl',
    'zonnet.nl',
    'bluewin.ch',
    'mac.com',
    'facebook.com',
    'verizon.net',
    'sbcglobal.net',
    'att.net',
    'gmx.com',
    'gmx.de',
    'mail.com',
    'outlook.com',
    'icloud.com',
    'outlook.com',
    'web.de',
  ];

  defaultTopLevelDomains = [
    'au',
    'co.jp',
    'co.uk',
    'com',
    'com.au',
    'net',
    'org',
    'info',
    'edu',
    'gov',
    'mil',
    'nl',
    'de',
    'dk',
    'no',
    'ca',
    'io',
    'tech',
    'nu',
    'net',
    'net.au',
    'info',
  ];

  constructor() {
    // Constructor
  }

  run(optsParam) {
    const opts = optsParam;
    opts.domains = opts.domains || this.defaultDomains;
    opts.topLevelDomains = opts.topLevelDomains || this.defaultTopLevelDomains;
    opts.distanceFunction = opts.distanceFunction || Emailcheck.sift3Distance;

    const defaultCallback = function fn(result) {
      return result;
    };
    const suggestedCallback = opts.suggested || defaultCallback;
    const emptyCallback = opts.empty || defaultCallback;

    const result = this.suggest(
      Emailcheck.encodeEmail(opts.email),
      opts.domains,
      opts.topLevelDomains,
      opts.distanceFunction,
    );

    return result ? suggestedCallback(result) : emptyCallback();
  }

  suggest(emailParam, domains, topLevelDomains, distanceFunction) {
    const email = emailParam.toLowerCase();

    const emailParts = Emailcheck.splitEmail(email);

    let closestDomain = this.findClosestDomain(
      emailParts.domain,
      domains,
      distanceFunction,
      this.domainThreshold,
    );

    if (closestDomain) {
      if (closestDomain !== emailParts.domain) {
        // The email address closely matches one of the supplied domains; return a suggestion
        return {
          address: emailParts.address,
          domain: closestDomain,
          full: `${emailParts.address}@${closestDomain}`,
        };
      }
    } else {
      // The email address does not closely match one of the supplied domains
      const closestTopLevelDomain = this.findClosestDomain(
        emailParts.topLevelDomain,
        topLevelDomains,
        distanceFunction,
        this.topLevelThreshold,
      );
      if (
        emailParts.domain &&
        closestTopLevelDomain &&
        closestTopLevelDomain !== emailParts.topLevelDomain
      ) {
        // The email address may have a mispelled top-level domain; return a suggestion
        const { domain } = emailParts;
        closestDomain =
          domain.substring(0, domain.lastIndexOf(emailParts.topLevelDomain)) +
          closestTopLevelDomain;
        return {
          address: emailParts.address,
          domain: closestDomain,
          full: `${emailParts.address}@${closestDomain}`,
        };
      }
    }
    /* The email address exactly matches one of the supplied domains, does not closely
     * match any domain and does not appear to simply have a mispelled top-level domain,
     * or is an invalid email address; do not return a suggestion.
     */
    return false;
  }

  findClosestDomain(domain, domains, distanceFunctionParam, thresholdParam) {
    const threshold = thresholdParam || this.topLevelThreshold;
    let dist;
    let minDist = 99;
    let closestDomain = null;

    if (!domain || !domains) {
      return false;
    }

    let distanceFunction = distanceFunctionParam;
    if (!distanceFunctionParam) {
      distanceFunction = Emailcheck.sift3Distance;
    }

    for (let i = 0; i < domains.length; i += 1) {
      if (domain === domains[i]) {
        return domain;
      }
      dist = distanceFunction(domain, domains[i]);
      if (dist < minDist) {
        minDist = dist;
        closestDomain = domains[i];
      }
    }

    if (minDist <= threshold && closestDomain !== null) {
      return closestDomain;
    }
    return false;
  }

  static sift3Distance(s1, s2) {
    // sift3: http://siderite.blogspot.com/2007/04/super-fast-and-accurate-string-distance.html
    if (s1 == null || s1.length === 0) {
      if (s2 == null || s2.length === 0) {
        return 0;
      }
      return s2.length;
    }

    if (s2 == null || s2.length === 0) {
      return s1.length;
    }

    let c = 0;
    let offset1 = 0;
    let offset2 = 0;
    let lcs = 0;
    const maxOffset = 5;

    while (c + offset1 < s1.length && c + offset2 < s2.length) {
      if (s1.charAt(c + offset1) === s2.charAt(c + offset2)) {
        lcs += 1;
      } else {
        offset1 = 0;
        offset2 = 0;
        for (let i = 0; i < maxOffset; i += 1) {
          if (c + i < s1.length && s1.charAt(c + i) === s2.charAt(c)) {
            offset1 = i;
            break;
          }
          if (c + i < s2.length && s1.charAt(c) === s2.charAt(c + i)) {
            offset2 = i;
            break;
          }
        }
      }
      c += 1;
    }
    return (s1.length + s2.length) / 2 - lcs;
  }

  static splitEmail(email) {
    const parts = email.trim().split('@');

    if (parts.length < 2) {
      return false;
    }

    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i] === '') {
        return false;
      }
    }

    const domain = parts.pop();
    const domainParts = domain.split('.');
    let tld = '';

    if (domainParts.length === 0) {
      // The address does not have a top-level domain
      return false;
    }
    if (domainParts.length === 1) {
      // The address has only a top-level domain (valid under RFC)
      tld = [domainParts];
    } else {
      // The address has a domain and a top-level domain
      for (let i = 1; i < domainParts.length; i += 1) {
        tld += `${domainParts[i]}.`;
      }
      if (domainParts.length >= 2) {
        tld = tld.substring(0, tld.length - 1);
      }
    }

    return {
      topLevelDomain: tld,
      domain,
      address: parts.join('@'),
    };
  }

  // Encode the email address to prevent XSS but leave in valid
  // characters, following this official spec:
  // http://en.wikipedia.org/wiki/Email_address#Syntax
  static encodeEmail(email) {
    let result = encodeURI(email);
    result = result
      .replace('%20', ' ')
      .replace('%25', '%')
      .replace('%5E', '^')
      .replace('%60', '`')
      .replace('%7B', '{')
      .replace('%7C', '|')
      .replace('%7D', '}');
    return result;
  }
}
