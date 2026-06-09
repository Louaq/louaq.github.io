/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
		]);

	if (!properties.repo || !properties.repo.includes("/"))
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attributte must be in the format "owner/repo")',
		);

	const repo = properties.repo;
	const cardUuid = `GC${Math.random().toString(36).slice(-6)}`; // Collisions are not important

	const nAvatar = h(`div#${cardUuid}-avatar`, { class: "gc-avatar" });
	const nLanguage = h(
		`span#${cardUuid}-language`,
		{ class: "gc-language" },
		"-",
	);

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, repo.split("/")[0]),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repo.split("/")[1]),
		]),
		h("div", { class: "github-logo" }),
	]);

	const nDescription = h(
		`div#${cardUuid}-description`,
		{ class: "gc-description" },
		"Loading repository info...",
	);

	const nStars = h(`div#${cardUuid}-stars`, { class: "gc-stars" }, "-");
	const nForks = h(`div#${cardUuid}-forks`, { class: "gc-forks" }, "-");
	const nLicense = h(`div#${cardUuid}-license`, { class: "gc-license" }, "-");

	const nScript = h(
		`script#${cardUuid}-script`,
		{ type: "text/javascript", defer: true },
		`
      (() => {
        const repo = ${JSON.stringify(repo)};
        const cardId = ${JSON.stringify(cardUuid)};
        const cacheKey = "github-card:" + repo;
        const cacheTtl = 1000 * 60 * 60 * 24 * 7;
        const requestTimeout = 3500;
        const memoryCache = window.__githubCardCache || (window.__githubCardCache = new Map());

        const el = (name) => document.getElementById(cardId + "-" + name);
        const compact = (value) => Intl.NumberFormat("en-us", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value || 0).replaceAll("\\u202f", "");

        const normalize = (data) => ({
          description: data.description?.replace(/:[a-zA-Z0-9_]+:/g, "") || "Description not set",
          language: data.language || "-",
          forks: data.forks,
          stars: data.stargazers_count,
          license: data.license?.spdx_id || "no-license",
          avatarUrl: data.owner?.avatar_url || "",
        });

        const render = (data) => {
          if (!data) return;
          el("description").innerText = data.description || "Description not set";
          el("language").innerText = data.language || "-";
          el("forks").innerText = compact(data.forks);
          el("stars").innerText = compact(data.stars);
          el("license").innerText = data.license || "no-license";

          const avatarEl = el("avatar");
          if (data.avatarUrl) {
            avatarEl.style.backgroundImage = "url(" + data.avatarUrl + "&s=32)";
            avatarEl.style.backgroundColor = "transparent";
          }

          const card = el("card");
          card?.classList.remove("fetch-waiting", "fetch-error");
        };

        const readStorageCache = () => {
          try {
            const payload = JSON.parse(localStorage.getItem(cacheKey) || "null");
            if (!payload || !payload.data || !payload.updatedAt) return null;
            return payload;
          } catch {
            return null;
          }
        };

        const writeCache = (data) => {
          const payload = { data, updatedAt: Date.now() };
          memoryCache.set(repo, payload);
          try {
            localStorage.setItem(cacheKey, JSON.stringify(payload));
          } catch {
            // Ignore storage quota and private-mode failures.
          }
        };

        const cached = memoryCache.get(repo) || readStorageCache();
        if (cached?.data) {
          render(cached.data);
          memoryCache.set(repo, cached);
          if (Date.now() - cached.updatedAt < cacheTtl) return;
        }

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), requestTimeout);

        fetch("https://api.github.com/repos/" + repo, {
          referrerPolicy: "no-referrer",
          signal: controller.signal,
        }).then((response) => {
          if (!response.ok) throw new Error("GitHub API returned " + response.status);
          return response.json();
        }).then((rawData) => {
          const data = normalize(rawData);
          writeCache(data);
          render(data);
        }).catch(() => {
          const card = el("card");
          card?.classList.remove("fetch-waiting");
          card?.classList.add("fetch-error");
          if (!cached?.data) {
            el("description").innerText = "Repository info unavailable";
          }
        }).finally(() => {
          clearTimeout(timer);
        });
      })();
    `,
	);

	return h(
		`a#${cardUuid}-card`,
		{
			class: "card-github fetch-waiting no-styling",
			href: `https://github.com/${repo}`,
			target: "_blank",
			repo,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gc-infobar" }, [nStars, nForks, nLicense, nLanguage]),
			nScript,
		],
	);
}
