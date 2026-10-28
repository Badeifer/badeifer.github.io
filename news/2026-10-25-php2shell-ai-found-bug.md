---
title: PHP2Shell: AI found a 14-year-old hole in the web's favourite language, and attackers moved in minutes
dek: Two critical PHP flaws let a single request take over a server. Frontier models helped find them, and the same speed is now on the attackers' side. Here is what to patch today.
date: 2026-10-25
topic: cyber
art: bug, server, skull
tags: PHP, vulnerabilities, AI security, patching
sources:
  - Help Net Security: PHP2Shell, critical PHP vulnerabilities patched | https://www.helpnetsecurity.com/2026/10/21/php2shell-php-vulnerabilities-patched-cve-2026-109618-cve-2026-109619/
  - Qualys: PHP2Shell, find, mitigate and patch now | https://blog.qualys.com/vulnerabilities-threat-research/2026/10/20/php-announces-critical-security-release-for-two-vulnerabilities
  - Fortune: AI helped discover the PHP vulnerability | https://fortune.com/2026/10/21/ai-tools-discovered-the-php-vulnerability-that-could-take-down-70-of-the-internet-now-the-race-is-on-to-patch-it-before-ai-powered-hackers-attack/
  - BleepingComputer: PHP ships emergency patches for critical PHP2Shell flaws | https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/
---
On October 21 the PHP project shipped emergency releases for two bugs it rates critical, now known together as **PHP2Shell**. Either one can hand an attacker code execution on a web server, and in the worst setup it takes one unauthenticated request that fires before a single line of the site's own code runs.

That alone would make it the week's biggest security story. What makes it a turning point is how it was found, and how fast it was used.

## What broke

Both flaws live in how PHP cleans up after a web request, not in any one app or framework.

- **CVE-2026-109618** comes from out-of-memory handling. If PHP runs out of memory at the wrong moment, request data is left half set up, and the cleanup that follows treats that broken data as real.
- **CVE-2026-109619** is stale global state. Data owned by one request can outlive the memory behind it, and the next request on the same worker can touch it before it is reset: a classic use-after-free.

Qualys scores both 9.2 on CVSS v4.0. Every PHP install that serves web traffic is in scope: PHP-FPM, Apache with mod_php, php-cgi, FrankenPHP and LiteSpeed. Apache with **mod_php** is the most urgent, because that is where the single-request takeover before any app code was demonstrated. Both bugs can also leak worker memory, which is where passwords, tokens and API keys tend to sit.

## The AI part

According to Fortune, the AI red-teaming firm Calif found the first issue on August 1 using OpenAI's GPT-5.6 Sol, as part of OpenAI's Patch the Planet programme, and took it to the PHP Foundation. Wiz found the same flaws independently later in August, using a mix of Gemini 4 Argon, GPT-5.6 Sol and its own tooling.

The code itself was not new. OpenAI's Greg Brockman put the bug's age at 14 years, and Wiz said the weakness had sat there for well over a decade because turning it into a working exploit needed an unusually long chain of steps. That chain is exactly what frontier models are now good at. Wiz called it an inflection point, and the Center for Internet Security made the same point: AI turns exploit chains that used to be theoretical into practical attacks.

> The defender's head start is now measured in hours, not months.

## How fast it went wrong

The timeline is the real story.

1. **October 17:** Amazon's honeypots logged an exploit attempt, four days before anything was public.
2. **October 21, disclosure:** within 45 minutes Cloudflare saw tens of thousands of attempts, and millions by that evening.
3. **Days after:** public proof-of-concept code spread on GitHub, and Amazon described the flaw as broadly exploited in the wild.

Qualys counts about 167 million PHP installs on internet-facing systems, and most of the ones with a known version are on branches that no longer get upstream fixes.

## What to do today

If you run anything on PHP, including a shop, a blog, a forum or an old side project, work down this list.

1. **Update PHP** to 8.5.12, 8.4.27, 8.3.36 or 8.2.35. On Linux, take your distribution's package first: it may keep an older version number with the fix backported.
2. **Check every copy.** Containers, bundled installs and parallel branches count, and `php -v` on the command line may not be the binary serving your site.
3. **On PHP 8.1 or older**, there are limited source backports for 7.4, 8.0 and 8.1, but the real fix is a vendor build or an upgrade.
4. **If you cannot patch right now:** set `session.upload_progress.enabled=0` in the main config (not `ini_set()` or `.user.ini`) and restart the workers. That is the most direct stopgap for CVE-2026-109619. Then tighten request size limits and keep the service behind a firewall or offline until it is patched; the UK's NCSC advises taking unpatchable systems offline.
5. **Put a WAF in front.** Cloudflare pushed rules for the known exploit paths to every plan, free included.
6. **Assume secrets may have leaked** on any server that was exposed and unpatched. Rotate database passwords and API keys.

Do not run public proof-of-concept scripts against production to "test" yourself. Use a scanner made for the job, such as the open-source one Help Net Security points to.

## The bigger picture

PHP2Shell is the clearest case yet of a pattern security people have been bracing for. The same models that help defenders sweep old code for deep bugs also collapse the time between disclosure and mass exploitation. A bug can sit quietly for a decade and then go from first report to millions of attacks in an afternoon.

For anyone shipping software, that changes the maths. Patching on a monthly cycle is now a risk on its own. Keep an inventory of what runs where, subscribe to your stack's security announcements, and make updating something you can do the same day.
