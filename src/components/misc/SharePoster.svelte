<script lang="ts">
import Icon from "@iconify/svelte";
import QRCode from "qrcode";
import { onMount } from "svelte";
import I18nKey from "../../i18n/i18nKey";
import { i18n } from "../../i18n/translation";

export let title: string;
export let author: string;
export let description = "";
export let pubDate: string;
export let coverImage: string | null = null;
export let url: string;
export let siteTitle: string;
export let avatar: string | null = null;

let showModal = false;
let posterImage: string | null = null;
let generating = false;
let themeColor = "#558e88"; // Default blue

onMount(() => {
	// Get theme color from CSS variable
	const temp = document.createElement("div");
	temp.style.color = "var(--primary)";
	temp.style.display = "none";
	document.body.appendChild(temp);
	const computedColor = getComputedStyle(temp).color;
	document.body.removeChild(temp);

	if (computedColor) {
		themeColor = computedColor;
	}
});

function loadImage(src: string): Promise<HTMLImageElement | null> {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => {
			if (!src.includes("images.weserv.nl")) {
				const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(src)}&output=png`;
				const proxyImg = new Image();
				proxyImg.crossOrigin = "anonymous";
				proxyImg.onload = () => resolve(proxyImg);
				proxyImg.onerror = () => {
					resolve(null);
				};
				proxyImg.src = proxyUrl;
			} else {
				resolve(null);
			}
		};
		img.src = src;
	});
}

function getLines(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
): string[] {
	const chars = text.split("");
	const lines: string[] = [];
	let currentLine = "";

	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		const width = ctx.measureText(currentLine + char).width;
		if (width < maxWidth) {
			currentLine += char;
		} else {
			lines.push(currentLine);
			currentLine = char;
		}
	}
	if (currentLine) {
		lines.push(currentLine);
	}
	return lines;
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
}

async function generatePoster() {
	showModal = true;
	if (posterImage) return;

	generating = true;
	try {
		const scale = 2;
		const width = 450 * scale;
		const padding = 32 * scale;

		// 1. Prepare resources
		const qrCodeUrl = await QRCode.toDataURL(url, {
			margin: 0,
			width: 120 * scale,
			color: { dark: "#000000", light: "#ffffff" },
		});
		
		// 多张固定默认图片，随机选择一张
		const defaultCoverImages = [
			"https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb15.jpg",
			"https://pic1.imgdb.cn/item/6919c43f3203f7be000aeb1e.jpg",
			"https://pic1.imgdb.cn/item/6919c43f3203f7be000aeb1b.jpg",
			"https://pic1.imgdb.cn/item/6919c43e3203f7be000aeb1a.jpg",
			"https://pic1.imgdb.cn/item/6919c43e3203f7be000aeb19.jpg",
			"https://pic1.imgdb.cn/item/6919c4403203f7be000aeb22.jpg",
			"https://pic1.imgdb.cn/item/6919c43d3203f7be000aeb16.jpg"
		];
		// 根据标题生成一个稳定的随机索引（同一标题总是选择相同的图片）
		const hashCode = title.split('').reduce((acc, char) => {
			return ((acc << 5) - acc) + char.charCodeAt(0);
		}, 0);
		const randomIndex = Math.abs(hashCode) % defaultCoverImages.length;
		const defaultCoverImage = defaultCoverImages[randomIndex];
		
		const finalCoverImage = coverImage || defaultCoverImage;
		
		const [qrImg, coverImg, avatarImg] = await Promise.all([
			loadImage(qrCodeUrl),
			loadImage(finalCoverImage),
			avatar ? loadImage(avatar) : Promise.resolve(null),
		]);

		// 2. Setup Canvas for measuring
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas context not available");

		canvas.width = width;
		canvas.height = 1200 * scale;

		// Parse Date - 使用当前系统日期
		let dateObj: { day: string; month: string; year: string } | null = null;
		try {
			const d = new Date(); // 使用当前系统时间
			dateObj = {
				day: d.getDate().toString().padStart(2, "0"),
				month: (d.getMonth() + 1).toString().padStart(2, "0"),
				year: d.getFullYear().toString(),
			};
		} catch (e) {}

		// 3. Layout Calculation
		const contentWidth = width - padding * 2;
		let currentY = padding; // 从顶部padding开始，不再有header

		// Cover image area (always show with default image)
		const coverHeight = 280 * scale;
		currentY += coverHeight;
		currentY += padding * 1.5;

		// Title and info section (需要为右侧日历留出空间)
		const dateBoxW = 80 * scale; // 日历宽度稍微增大
		const dateBoxH = 80 * scale; // 日历高度稍微增大
		const infoContentWidth = contentWidth - dateBoxW - padding; // 文字区域宽度减去日历宽度

		// Title
		ctx.font = `700 ${32 * scale}px 'Roboto', sans-serif`; // 字体从26增大到32
		const titleLines = getLines(ctx, title, infoContentWidth);
		const titleLineHeight = 44 * scale; // 行高从36增大到44
		const titleHeight = Math.min(titleLines.length, 3) * titleLineHeight;
		currentY += titleHeight;
		currentY += padding; // Gap

		// Description
		let descHeight = 0;
		if (description) {
			ctx.font = `400 ${18 * scale}px 'Roboto', sans-serif`; // 字体从15增大到18
			const descLines = getLines(ctx, description, infoContentWidth);
			const maxDescLines = 4;
			const displayDescLines = descLines.slice(0, maxDescLines);
			const descLineHeight = 30 * scale; // 行高从26增大到30
			descHeight = displayDescLines.length * descLineHeight;
			currentY += descHeight;
			currentY += padding * 1.5; // 减少描述后的间距，从1.5改为0.5
		}

		// Footer
		const footerHeight = 80 * scale;
		currentY += footerHeight;
		currentY += padding * 0.2; // 减少底部padding，从padding改为padding * 0.5

		// 4. Resize Canvas to fit content
		canvas.height = currentY;

		// 5. Draw Content
		// Fill Background with soft color
		const gradient1 = ctx.createLinearGradient(0, 0, 0, canvas.height);
		gradient1.addColorStop(0, "#f0f9f4");
		gradient1.addColorStop(1, "#fafbfc");
		ctx.fillStyle = gradient1;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// 移除顶部header装饰

		// Reset Y for content (从顶部padding开始)
		let drawY = padding;

		// Draw Cover Image with enhanced styling (always show)
		if (coverImg) {
			ctx.save();
			
			// Rounded rectangle clip for cover
			const coverY = drawY;
			const coverRadius = 14 * scale;
			drawRoundedRect(ctx, padding, coverY, contentWidth, coverHeight, coverRadius);
			ctx.clip();

			// Object-fit: cover implementation
			const imgRatio = coverImg.width / coverImg.height;
			const targetRatio = contentWidth / coverHeight;
			let sx: number, sy: number, sWidth: number, sHeight: number;

			if (imgRatio > targetRatio) {
				sHeight = coverImg.height;
				sWidth = sHeight * targetRatio;
				sx = (coverImg.width - sWidth) / 2;
				sy = 0;
			} else {
				sWidth = coverImg.width;
				sHeight = sWidth / targetRatio;
				sx = 0;
				sy = (coverImg.height - sHeight) / 2;
			}
			
			ctx.drawImage(coverImg, sx, sy, sWidth, sHeight, padding, coverY, contentWidth, coverHeight);
			ctx.restore();

			// Enhanced cover border with gradient
			ctx.save();
			const borderGradient = ctx.createLinearGradient(padding, coverY, padding, coverY + coverHeight);
			borderGradient.addColorStop(0, "rgba(0, 0, 0, 0.08)");
			borderGradient.addColorStop(1, "rgba(0, 0, 0, 0.03)");
			ctx.strokeStyle = borderGradient;
			ctx.lineWidth = 2 * scale;
			drawRoundedRect(ctx, padding, coverY, contentWidth, coverHeight, coverRadius);
			ctx.stroke();
			ctx.restore();
			
			// Add subtle inner shadow effect
			ctx.save();
			ctx.globalCompositeOperation = "multiply";
			ctx.globalAlpha = 0.03;
			const shadowGradient = ctx.createLinearGradient(padding, coverY, padding, coverY + 30 * scale);
			shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
			shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = shadowGradient;
			drawRoundedRect(ctx, padding, coverY, contentWidth, 30 * scale, coverRadius);
			ctx.fill();
			ctx.restore();

			drawY += coverHeight + padding * 1.5;
		}

		// 记录标题开始位置，用于计算日历位置
		const titleStartY = drawY;

		// Draw Title with enhanced shadow and highlight
		ctx.textBaseline = "top";
		ctx.textAlign = "left";
		ctx.save();
		
		// Multiple shadow layers for depth
		ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
		ctx.shadowBlur = 4 * scale;
		ctx.shadowOffsetY = 2 * scale;
		
		ctx.font = `800 ${32 * scale}px 'Roboto', sans-serif`; // 增大字体
		ctx.fillStyle = "#0f172a";
		
		titleLines.slice(0, 3).forEach((line, index) => {
			// Add subtle highlight effect
			if (index === 0) {
				ctx.save();
				ctx.globalAlpha = 0.5;
				ctx.fillStyle = themeColor;
				ctx.fillText(line, padding - 1 * scale, drawY - 1 * scale);
				ctx.restore();
			}
			ctx.fillStyle = "#0f172a";
			ctx.fillText(line, padding, drawY);
			drawY += titleLineHeight;
		});
		ctx.restore();
		
		// Add decorative underline for title
		ctx.save();
		const underlineGradient = ctx.createLinearGradient(padding, 0, padding + 60 * scale, 0);
		underlineGradient.addColorStop(0, themeColor);
		underlineGradient.addColorStop(1, "rgba(85, 142, 136, 0)");
		ctx.fillStyle = underlineGradient;
		ctx.fillRect(padding, drawY + 4 * scale, 60 * scale, 3 * scale);
		ctx.restore();
		
		drawY += padding - titleLineHeight + (32 * scale); // 调整字体大小

		// Draw Description with enhanced styling
		if (description) {
			// Add decorative quote mark or icon
			ctx.save();
			ctx.fillStyle = themeColor;
			ctx.globalAlpha = 0.15;
			ctx.font = `900 ${48 * scale}px 'Roboto', sans-serif`;
			ctx.fillText('"', padding - 4 * scale, drawY - 12 * scale);
			ctx.restore();
			
			// Description text with better spacing
			ctx.font = `400 ${18 * scale}px 'Roboto', sans-serif`; // 增大字体
			ctx.fillStyle = "#475569";
			const descLines = getLines(ctx, description, infoContentWidth);
			const maxDescLines = 4;

			descLines.slice(0, maxDescLines).forEach((line, index) => {
				// Add subtle fade effect on last line
				if (index === maxDescLines - 1 && descLines.length > maxDescLines) {
					ctx.save();
					const fadeGradient = ctx.createLinearGradient(padding, drawY, padding + infoContentWidth, drawY);
					fadeGradient.addColorStop(0, "#475569");
					fadeGradient.addColorStop(0.8, "#475569");
					fadeGradient.addColorStop(1, "rgba(71, 85, 105, 0)");
					ctx.fillStyle = fadeGradient;
					ctx.fillText(line + "...", padding, drawY);
					ctx.restore();
				} else {
					ctx.fillText(line, padding, drawY);
				}
				drawY += 30 * scale; // 增大行高
			});
			drawY += padding * 1.5 - (30 * scale); // 减少描述后的间距，从1.5改为0.5
		}

		// Draw Date box on the right side (在标题和描述的右侧)
		if (dateObj) {
			const dateBoxX = width - padding - dateBoxW;
			const dateBoxY = titleStartY;

			// Date box background with enhanced shadow
			ctx.save();
			ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
			ctx.shadowBlur = 16 * scale;
			ctx.shadowOffsetY = 6 * scale;
			
			// Gradient background for date box
			const dateGradient = ctx.createLinearGradient(dateBoxX, dateBoxY, dateBoxX, dateBoxY + dateBoxH);
			dateGradient.addColorStop(0, "#ffffff");
			dateGradient.addColorStop(1, "#f8f9fa");
			ctx.fillStyle = dateGradient;
			drawRoundedRect(ctx, dateBoxX, dateBoxY, dateBoxW, dateBoxH, 12 * scale);
			ctx.fill();
			ctx.restore();
			
			// 添加顶部装饰条
			ctx.save();
			ctx.fillStyle = "#ef4444"; // 红色装饰条
			drawRoundedRect(ctx, dateBoxX, dateBoxY, dateBoxW, 8 * scale, 12 * scale);
			ctx.fill();
			ctx.restore();
			
			// 添加左上角装饰点
			ctx.save();
			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.arc(dateBoxX + 12 * scale, dateBoxY + 4 * scale, 2 * scale, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
			
			// 添加右上角装饰点
			ctx.save();
			ctx.fillStyle = "#ffffff";
			ctx.beginPath();
			ctx.arc(dateBoxX + dateBoxW - 12 * scale, dateBoxY + 4 * scale, 2 * scale, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
			
			// 添加微妙的边框
			ctx.save();
			ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
			ctx.lineWidth = 1 * scale;
			drawRoundedRect(ctx, dateBoxX, dateBoxY, dateBoxW, dateBoxH, 12 * scale);
			ctx.stroke();
			ctx.restore();

			// Day number with gradient (增大字体)
			const dayGradient = ctx.createLinearGradient(dateBoxX, dateBoxY + dateBoxH * 0.35, dateBoxX, dateBoxY + dateBoxH * 0.55);
			dayGradient.addColorStop(0, "#1a202c");
			dayGradient.addColorStop(1, "#2d3748");
			ctx.fillStyle = dayGradient;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = `800 ${40 * scale}px 'Roboto', sans-serif`;
			
			// 给数字添加微妙阴影
			ctx.save();
			ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
			ctx.shadowBlur = 2 * scale;
			ctx.shadowOffsetY = 1 * scale;
			ctx.fillText(dateObj.day, dateBoxX + dateBoxW / 2, dateBoxY + dateBoxH * 0.45);
			ctx.restore();

			// Elegant divider line with decorative dots
			ctx.beginPath();
			const lineGradient = ctx.createLinearGradient(dateBoxX + 14 * scale, 0, dateBoxX + dateBoxW - 14 * scale, 0);
			lineGradient.addColorStop(0, "rgba(226, 232, 240, 0)");
			lineGradient.addColorStop(0.5, "#cbd5e0");
			lineGradient.addColorStop(1, "rgba(226, 232, 240, 0)");
			ctx.strokeStyle = lineGradient;
			ctx.lineWidth = 1.5 * scale;
			ctx.moveTo(dateBoxX + 14 * scale, dateBoxY + dateBoxH * 0.68);
			ctx.lineTo(dateBoxX + dateBoxW - 14 * scale, dateBoxY + dateBoxH * 0.68);
			ctx.stroke();
			
			// 添加分割线两端的装饰小圆点
			ctx.save();
			ctx.fillStyle = "#cbd5e0";
			ctx.beginPath();
			ctx.arc(dateBoxX + 14 * scale, dateBoxY + dateBoxH * 0.68, 1.5 * scale, 0, Math.PI * 2);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(dateBoxX + dateBoxW - 14 * scale, dateBoxY + dateBoxH * 0.68, 1.5 * scale, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();

			// Month and Year with icon-like decoration
			ctx.fillStyle = "#64748b";
			ctx.font = `600 ${13 * scale}px 'Roboto', sans-serif`;
			ctx.fillText(
				`${dateObj.year}.${dateObj.month}`,
				dateBoxX + dateBoxW / 2,
				dateBoxY + dateBoxH * 0.87
			);
			
			// 添加底部微妙的装饰图案（小圆点）
			ctx.save();
			ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
			for (let i = 0; i < 3; i++) {
				const dotX = dateBoxX + dateBoxW / 2 - 8 * scale + i * 8 * scale;
				const dotY = dateBoxY + dateBoxH - 6 * scale;
				ctx.beginPath();
				ctx.arc(dotX, dotY, 1.5 * scale, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.restore();
		}

		// Draw Footer with enhanced divider
		const footerY = drawY;
		
		// Elegant gradient divider
		ctx.save();
		const dividerGradient = ctx.createLinearGradient(padding, footerY, width - padding, footerY);
		dividerGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
		dividerGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.1)");
		dividerGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
		ctx.strokeStyle = dividerGradient;
		ctx.lineWidth = 1.5 * scale;
		ctx.beginPath();
		ctx.moveTo(padding, footerY);
		ctx.lineTo(width - padding, footerY);
		ctx.stroke();
		ctx.restore();
		
		drawY += padding * 0.8; // 减少分割线后的间距，从0.8改为0.4

		// Left: Enhanced Author info with avatar
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		
		const avatarSize = 52 * scale;
		const avatarX = padding;
		const avatarCenterY = drawY + avatarSize / 2;

		if (avatarImg) {
			// Circle clip for avatar
			ctx.save();
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarCenterY, avatarSize / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(avatarImg, avatarX, drawY, avatarSize, avatarSize);
			ctx.restore();

			// Simple avatar border
			ctx.save();
			ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
			ctx.lineWidth = 2 * scale;
			ctx.beginPath();
			ctx.arc(avatarX + avatarSize / 2, avatarCenterY, avatarSize / 2, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();
		}

		// Author text with icon
		const authorTextX = avatarX + (avatar ? avatarSize + 14 * scale : 0);
		
		ctx.fillStyle = "#64748b";
		ctx.font = `500 ${14 * scale}px 'Roboto', sans-serif`; // 从12增大到14
		ctx.fillText(i18n(I18nKey.author), authorTextX, avatarCenterY - 16 * scale);

		// Author name with gradient
		const authorNameGradient = ctx.createLinearGradient(
			authorTextX, avatarCenterY, 
			authorTextX + 100 * scale, avatarCenterY
		);
		authorNameGradient.addColorStop(0, "#1e293b");
		authorNameGradient.addColorStop(1, "#334155");
		ctx.fillStyle = authorNameGradient;
		ctx.font = `700 ${22 * scale}px 'Roboto', sans-serif`; // 从19增大到22
		ctx.fillText(author, authorTextX, avatarCenterY + 12 * scale);

		// Right: Simple QR Code
		const qrSize = 76 * scale;
		const qrX = width - padding - qrSize;
		const qrY = drawY - 8 * scale;

		// 直接绘制二维码，不添加背景、阴影和边框
		ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

		// Site info with enhanced styling
		ctx.textAlign = "right";
		const siteInfoX = qrX - 16 * scale;
		
		ctx.fillStyle = "#94a3b8";
		ctx.font = `500 ${13 * scale}px 'Roboto', sans-serif`; // 从11增大到13
		ctx.fillText(i18n(I18nKey.scanToRead), siteInfoX, avatarCenterY - 14 * scale);

		// Site title with gradient
		const siteTitleGradient = ctx.createLinearGradient(
			siteInfoX - 100 * scale, avatarCenterY, 
			siteInfoX, avatarCenterY
		);
		siteTitleGradient.addColorStop(0, "#334155");
		siteTitleGradient.addColorStop(1, "#1e293b");
		ctx.fillStyle = siteTitleGradient;
		ctx.font = `700 ${20 * scale}px 'Roboto', sans-serif`; // 从18增大到20
		ctx.fillText(siteTitle, siteInfoX, avatarCenterY + 12 * scale);

		// Finalize
		posterImage = canvas.toDataURL("image/png");
		generating = false;
	} catch (error) {
		console.error("Failed to generate poster:", error);
		generating = false;
	}
}

function downloadPoster() {
	if (posterImage) {
		const a = document.createElement("a");
		a.href = posterImage;
		a.download = `poster-${title.replace(/\s+/g, "-")}.png`;
		a.click();
	}
}

function closeModal() {
	showModal = false;
}

let copied = false;
function copyLink() {
	navigator.clipboard.writeText(url);
	copied = true;
	setTimeout(() => {
		copied = false;
	}, 2000);
}

function portal(node: HTMLElement) {
	document.body.appendChild(node);
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		},
	};
}
</script>

<!-- Trigger Button -->
<button 
  class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black/5 text-[var(--primary)] rounded-lg font-medium hover:bg-[var(--primary)]/10 hover:scale-105 active:scale-95 transition-all whitespace-nowrap border border-[var(--primary)]/20"
  on:click={generatePoster}
  aria-label="Generate Share Poster"
>
  <Icon icon="material-symbols:share" width="20" height="20" />
  <span>{i18n(I18nKey.shareArticle)}</span>
</button>



<!-- Modal -->
{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div use:portal class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity" on:click={closeModal}>
    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl transform transition-all" on:click|stopPropagation>
      
      <div class="p-6 flex justify-center bg-gray-50 dark:bg-gray-900 min-h-[200px] items-center">
        {#if posterImage}
          <img src={posterImage} alt="Poster" class="max-w-full h-auto shadow-lg rounded-lg" />
        {:else}
           <div class="flex flex-col items-center gap-3">
             <div class="w-8 h-8 border-2 border-gray-200 rounded-full animate-spin" style="border-top-color: {themeColor}"></div>
             <span class="text-sm text-gray-500">{i18n(I18nKey.generatingPoster)}</span>
           </div>
        {/if}
      </div>
      
      <div class="p-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-3">
        <button 
          class="py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          on:click={copyLink}
        >
          {#if copied}
            <Icon icon="material-symbols:check" width="20" height="20" />
            <span>{i18n(I18nKey.copied)}</span>
          {:else}
            <Icon icon="material-symbols:link" width="20" height="20" />
            <span>{i18n(I18nKey.copyLink)}</span>
          {/if}
        </button>
        <button 
          class="py-3 text-white rounded-xl font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-90"
          style="background-color: {themeColor};"
          on:click={downloadPoster}
          disabled={!posterImage}
        >
          <Icon icon="material-symbols:download" width="20" height="20" />
          {i18n(I18nKey.savePoster)}
        </button>
      </div>
    </div>
  </div>
{/if}