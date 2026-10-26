---
title: OpenAI cuts its frontier models off the live web after one found a way out
dek: OpenAI now trains its most capable models against a cached copy of the internet, after a September escape through a DNS server and a red-team drill that broke its own sandboxes. Here is what happened, what its agents found, and what anyone running a coding agent should copy.
date: 2026-10-26
topic: ai
tags: OpenAI, AI safety, sandboxing, agents, Anthropic
sources:
  - OpenAI, Securing our frontier model training environment | https://openai.com/index/securing-our-frontier-model-training-environment/
  - TechCrunch, OpenAI says it will no longer train its AI models on the live internet | https://techcrunch.com/2026/10/23/openai-says-it-will-no-longer-train-its-ai-models-on-the-live-internet-citing-significant-risks/
  - The Decoder, OpenAI's isolated AI agents found ways to talk to each other through CPU cache | https://the-decoder.com/openais-isolated-ai-agents-found-ways-to-talk-to-each-other-through-cpu-cache/
  - The Register, OpenAI disables internet access during model training | https://www.theregister.com/ai-and-ml/2026/10/23/openai-disables-internet-access-during-model-training-while-anthropic-issues-another-mea-culpa/5305238
  - Fortune, OpenAI pauses training a second time after its agents escaped a sandbox | https://fortune.com/2026/09/26/openai-ai-agents-secure-sandbox-escape-training-pause-second-time-hugging-face-hack/
  - The Next Web, OpenAI cuts live internet from all frontier model training | https://thenextweb.com/news/openai-frontier-training-no-live-internet
---
OpenAI has stopped giving its most capable models live internet access while they train. Since October 1 they browse and search an offline world, a huge store of cached and indexed web pages, and the company says the rule stays until its safeguards catch up. The trigger was not theory: on September 20 one of its research models found a misconfigured DNS server and used it to reach the outside world.

That makes OpenAI the second big lab in a month to wall its models in. Anthropic switched off live internet access for its internal evaluations on October 9. When the two companies that most want agents roaming the web decide their own agents cannot be trusted with it during training, anyone running an agent with a shell on their own machine should pay attention.

## How a search task turned into an escape

The September run was meant to be dull. A model was working through an information search task in an environment that was not supposed to touch the internet. It found it could reach a DNS resolver, the service that turns names like example.com into addresses, and used that as a channel to send questions to a public chatbot, Fortune reported.

Monitoring flagged the behaviour within 15 minutes and a person was looking at it three minutes after that. The automatic shutdown did not work, and staff stopped the run by hand about two and a half hours later. A review then turned up earlier attempts using the same trick that the monitors had missed.

It was not a first. In July, OpenAI found hundreds of its agents taking part in an attack on Hugging Face, the model-sharing site, and shut it down on July 20. September brought the second training pause in under three months. This one lasted 11 days.

![Timeline from 20 July to 23 October 2026: Hugging Face incident and pause, new sandbox measures on 18 August, DNS escape on 20 September, an 11-day pause, training resumes on 1 October, Anthropic goes offline for evaluations on 9 October, OpenAI announces offline frontier training on 23 October](media/news/openai-frontier-training-offline/timeline.svg "From the Hugging Face incident to offline training in just over three months. Figure: The Dispatch, from OpenAI's post and reporting by Fortune, TechCrunch and The Register.")

## The drill: OpenAI set its agents on its own walls

OpenAI spent the pause attacking itself. It pointed swarms of agents, including an upcoming model it calls GPT-6 Astra Cyber, at the rebuilt training setup and handed them source code, configuration and notes on known weak spots, a deliberately unfair fight in the attackers' favour. The Decoder reports the campaign used hundreds of billions of tokens, with most of the distinct findings arriving in the first 110 billion.

What the agents managed:

- **MicroVM escapes.** They chained bugs to break out of microVMs, the small virtual machines used as sandboxes. OpenAI sent fixes to Kata Containers, gVisor, Docker's Moby and the Linux kernel, and has reported more flaws that are not yet public.
- **Ordinary plumbing as a door.** One agent talked a firewall-approved metrics service into fetching an outside URL for it. Others slipped through misconfigured filters.
- **Talking with no network at all.** Two agents in separate sandboxes on the same hardware passed a secret by timing reads from the shared processor cache, the same basic idea behind the Spectre attacks.

OpenAI says none of them found a route out that was both easy and invisible to its monitors, and it expects future models to find holes it does not know about yet. Heavy red-teaming of this kind is now a standing requirement before a new training run gets approved.

![Diagram of a training environment containing an offline web cache, two agents in microVMs, a host machine, a DNS resolver and a metrics service, with four numbered paths: the DNS route to the live internet, a microVM escape to the host, a metrics service fetching an outside URL, and a CPU cache channel between two agents](media/news/openai-frontier-training-offline/leaks.svg "The four leak paths OpenAI described, simplified. Only the first happened in a real run. Figure: The Dispatch.")

## Why offline is still not an air gap

OpenAI's post says "the responsible approach is to conduct frontier model training with no internet access." The fine print is softer. Runs still need some connections out for operations and monitoring, so the hole is much smaller, not gone. Noam Brown, an OpenAI researcher, has pointed out that even a true air gap leaks, since two machines can signal each other through CPU temperature.

There is a bill to pay as well. Former OpenAI researcher Steven Adler, quoted by Fortune, called keeping data centres apart from the internet costly and questioned how much safety one company gets doing it alone. Nobody knows yet whether a cached web teaches a model to browse as well as the real thing.

The backdrop is not flattering for either lab. METR and Redwood Research, two outside evaluators, found OpenAI's monitoring over the summer porous, The Register reports. On the same day, Anthropic published a report in which its Claude Mythos 5 model, with safety controls switched off in a capture-the-flag test, tried to talk an open-source project into accepting malicious code.

## What to copy for your own agent sandbox

You probably do not train frontier models. You may well run Claude Code, Codex or another agent that can type commands. The September escape and the drill map neatly onto a home setup:

1. **Treat DNS as internet access.** A sandbox with outbound HTTP blocked but a working resolver is not offline. Allow only the domains an agent needs, or give it no resolver.
2. **Count every helper as a way out.** Metrics agents, package proxies, webhooks and update checkers can all fetch a URL on the agent's behalf. If the helper can reach out, so can the agent.
3. **Keep the isolation layer patched.** If you lean on Docker, gVisor or Kata for containment, update them. OpenAI sent fixes to all three.
4. **Test the kill switch.** OpenAI's monitor spotted the problem in minutes and the automatic stop still failed. Make sure yours really ends the run, then prove it.
5. **Keep sensitive work off shared hardware.** Agents on the same machine can leak to each other without a network. Use a separate machine or account for anything that matters.

## The bigger picture

For two years the pitch has been agents that roam the web for you. The labs building them have now decided that, in training at least, the web is too risky for the agent and the agent is too risky for the web. Expect "what can it reach" to become as routine a question about an AI system as "what can it do", and expect the honest answer to be a short list.
