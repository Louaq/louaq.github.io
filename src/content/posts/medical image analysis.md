---
title: 研究热点
published: 2026-09-07 21:15:00
expires: 2026-10-21 23:59:59
description: "热点演进与当前研究问题"
category: 投稿
tags: [Nature]
homeCarousel: true
homeCarouselOrder: 3
---

## 热点演进与当前研究问题

![Snipaste_2026-09-07_21-12-55](https://pic1.imgdb.cn/i/034KhUV4abknKDK7h0ynW6.png)

| 代表性阶段 | 热点课题 | 演进线索 | 值得解决的问题（调研者归纳） |
|---|---|---|---|
| 2022起，持续发展 | 三维自监督与低标注学习 | [Swin UNETR](https://doi.org/10.1109/cvpr52688.2022.02007)、[NeuroVFM](https://doi.org/10.1038/s41591-026-04497-1) | 如何让预训练保留细微病变，并同时适应CT/MRI、扫描协议与分辨率变化？ |
| 2022起，2025—2026升级 | 影像—报告—病历联合学习 | [CheXzero](https://doi.org/10.1038/s41551-022-00936-9)、[LLaVA-Med](https://doi.org/10.52202/075280-1240)、[RadFM](https://doi.org/10.1038/s41467-025-62385-7)、[Merlin](https://doi.org/10.1038/s41586-026-10181-8) | 如何使报告中的每项发现都能对应到图像区域，并处理长报告和多期相检查？ |
| 2023起，2026转向时间建模 | 眼底全身健康表征与纵向风险预测 | [RETFound](https://doi.org/10.1038/s41586-023-06555-x)、[RETFound Plus](https://doi.org/10.1038/s41746-026-02524-6) | 如何区分个体疾病进展和采集变化，控制混杂、随访偏差与时间泄漏？ |
| 2024起，持续热点 | 通用可提示分割 | [MedSAM](https://doi.org/10.1038/s41467-024-44824-z)、[BiomedParse](https://doi.org/10.1038/s41592-024-02499-w)、[MedSegX / MedSegDB](https://doi.org/10.1038/s41551-025-01497-3) | 如何应对未知病灶、跨医院分布变化、提示误差及不同任务间的负迁移？ |
| 2024起，2025—2026深化 | 全切片病理基础模型 | [UNI](https://doi.org/10.1038/s41591-024-02857-3)、[CONCH](https://doi.org/10.1038/s41591-024-02856-4)、[Prov-GigaPath](https://doi.org/10.1038/s41586-024-07441-w)、[TITAN](https://doi.org/10.1038/s41591-025-03982-3) | 如何保留细胞到组织的多尺度关系，并把报告语义落实到真正的阳性区域？ |
| 2024起，2026扩展 | 可控合成与跨染色表征 | [MINIM](https://doi.org/10.1038/s41591-024-03359-y)、[FeatStainDiff](https://doi.org/10.1016/j.media.2026.104138) | 生成的稀有病灶或分子特征是否真实，是否能改善完全独立的真实测试集？ |
| 2025起，快速发展 | 原生三维、视频与示例驱动分割 | [nnInteractive](https://doi.org/10.48550/arxiv.2503.08373)、[MedSAM2](https://doi.org/10.48550/arxiv.2504.03600)、[Iris / Show and Segment](https://doi.org/10.1109/cvpr52734.2025.01940) | 如何降低修正次数和总标注时间，同时保持三维连通性和帧间一致性？ |
| 2025起，实用价值高 | 多专家适配、知识蒸馏与低成本部署 | [MedSegX / MedSegDB](https://doi.org/10.1038/s41551-025-01497-3)、[From Generalist to Specialist](https://doi.org/10.1007/978-3-032-04937-7_19)、[SegMoTE](https://doi.org/10.48550/arxiv.2602.19213) | 如何选择教师和专家，防止错误传递，并保证少数人群与少见病灶表现？ |
| 2025起，跨学科前沿 | 超声主动采集与自主扫描 | [UltraBot](https://doi.org/10.1038/s41467-025-62865-w) | 模型能否根据解剖覆盖和不确定性主动补扫、选择切面并安全退出？ |
| 2025—2026，跨学科前沿 | 病理—空间组学与虚拟组织 | [STPath](https://doi.org/10.1038/s41746-025-02020-3)、[VirTues](https://doi.org/10.1038/s41586-026-10884-y) | 如何跨测序平台或抗体面板迁移，并给出可被实验检验的空间生物标志物？ |
| 2026，值得追踪 | 医学影像智能体与工具调用 | [MedSAM-Agent](https://doi.org/10.48550/arxiv.2602.03320)、[SPARK](https://doi.org/10.1038/s41591-026-04357-y) | 如何约束多步分析、验证中间结果、停止无效操作，并防止重复探索验证集？ |
| 2026，明显加强 | 概念可解释性与鲁棒性审计 | [PathoROB](https://doi.org/10.1038/s41467-026-73923-2)、[CLEAR](https://doi.org/10.1038/s41551-026-01741-4) | 模型是否使用真实病理证据，还是医院、扫描仪和报告风格等捷径？ |
| 2025—2026，临床核心问题 | 前瞻性人机协作和流程收益 | [PRAIM](https://doi.org/10.1038/s41591-024-03408-6)、[LungIMPACT](https://doi.org/10.1038/s41591-026-04253-5)、[LiON](https://doi.org/10.1038/s41591-026-04589-y) | AI是否减少漏诊、等待时间或无效检查；收益来自模型还是同时发生的流程改变？ |

## 逐篇时间线

| 编号 | 排序日期 | 论文/模型 | 来源及状态 | 热点与主要贡献 |
|---|---|---|---|---|
| [1] | 2022-06 | [Swin UNETR](https://doi.org/10.1109/cvpr52688.2022.02007) | CVPR 2022；正式会议 | **三维自监督预训练**：把三维解剖结构的表征学习放到下游分割之前，利用图像修复、旋转和对比任务减少对标注的依赖。 |
| [2] | 2022-09-15 | [CheXzero](https://doi.org/10.1038/s41551-022-00936-9) | Nature Biomedical Engineering；正式期刊 | **影像—报告对齐与零样本识别**：从胸片及其配对报告学习，使未显式训练的病理类别也能通过文本查询进行识别。 |
| [3] | 2023-09-13 | [RETFound](https://doi.org/10.1038/s41586-023-06555-x) | Nature；正式期刊 | **器官专用基础模型与眼底全身健康预测**：通过大规模无标注眼底照片和OCT预训练，迁移到眼病诊断、预后及部分系统性疾病风险任务。 |
| [4] | 2023-12 | [LLaVA-Med](https://doi.org/10.52202/075280-1240) | NeurIPS 2023 Datasets and Benchmarks Track；正式会议 | **医学视觉语言助手与指令微调**：利用生物医学图文与生成的指令数据训练可进行开放式图像问答的助手。 |
| [5] | 2024-01-22 | [MedSAM](https://doi.org/10.1038/s41467-024-44824-z) | Nature Communications；正式期刊 | **可提示通用医学分割**：将通用分割模型适配到多种医学影像任务，通过提示实现统一分割接口。 |
| [6] | 2024-03-19 | [CONCH](https://doi.org/10.1038/s41591-024-02856-4) | Nature Medicine；正式期刊 | **病理图文对齐**：将病理形态与自然语言联系起来，拓展检索、分类和文本驱动分析。 |
| [7] | 2024-03-19 | [UNI](https://doi.org/10.1038/s41591-024-02857-3) | Nature Medicine；正式期刊 | **病理自监督基础模型**：大规模病理图像预训练支持多类下游任务及少样本迁移，提供通用病理特征。 |
| [8] | 2024-05-22 | [Prov-GigaPath](https://doi.org/10.1038/s41586-024-07441-w) | Nature；正式期刊 | **全切片多尺度与长上下文建模**：以真实世界全切片数据学习病理表征，并用长序列架构处理大量图像块之间的联系。 |
| [9] | 2024-11-18 | [BiomedParse](https://doi.org/10.1038/s41592-024-02499-w) | Nature Methods；正式期刊 | **分割、检测与识别的统一建模**：跨九种生物医学模态联合处理分割、检测和识别，体现从单任务走向统一解析的趋势。 |
| [10] | 2024-12-11 | [MINIM](https://doi.org/10.1038/s41591-024-03359-y) | Nature Medicine；正式期刊 | **医学合成数据与可控生成**：根据文字合成多器官、多模态医学影像，并评估合成数据对多种下游任务的帮助。 |
| [11] | 2025-01-07 | [PRAIM](https://doi.org/10.1038/s41591-024-03408-6) | Nature Medicine；正式期刊 | **前瞻性真实世界人机协作**：在多中心乳腺筛查实施研究中，AI辅助双阅片与更高癌症检出率相关，且未损害召回率指标。 |
| [12] | 2025-03-11 | [nnInteractive](https://doi.org/10.48550/arxiv.2503.08373) | arXiv；预印本 | **原生三维交互分割**：支持点、涂画、框和套索等交互方式，并接入常用医学图像查看工具。 |
| [13] | 2025-03-26 | [GenMI观点综述](https://doi.org/10.1038/s41586-025-08675-y) | Nature；观点文章 | **医学报告生成与人机协作评估**：总结多模态生成式医学图像解读的机会及挑战，强调可靠报告生成和临床人员参与。 |
| [14] | 2025-04-04 | [MedSAM2](https://doi.org/10.48550/arxiv.2504.03600) | arXiv；预印本 | **三维与视频的可提示分割**：把可提示分割拓展到三维影像和医学视频，并通过用户研究考察标注成本。 |
| [15] | 2025-06 | [Iris / Show and Segment](https://doi.org/10.1109/cvpr52734.2025.01940) | CVPR 2025；正式会议 | **示例驱动的上下文分割**：给定参考图像及其掩膜，模型在不针对新任务微调的情况下完成查询图像分割。 |
| [16] | 2025-08-23 | [RadFM](https://doi.org/10.1038/s41467-025-62385-7) | Nature Communications；正式期刊 | **二维与三维统一的放射学视觉语言模型**：联合二维和三维影像及文本，用统一框架支持问答、报告和诊断相关任务。 |
| [17] | 2025-08-23 | [UltraBot](https://doi.org/10.1038/s41467-025-62865-w) | Nature Communications；正式期刊 | **超声主动采集与具身影像分析**：把图像理解、探头控制、测量和斑块筛查纳入自主颈动脉超声流程。 |
| [18] | 2025-09-05 | [MedSegX / MedSegDB](https://doi.org/10.1038/s41551-025-01497-3) | Nature Biomedical Engineering；正式期刊 | **开放场景分割与专家适配**：通过层次化数据组织和适配器专家混合，减少异质任务负迁移并评估分布外泛化。 |
| [19] | 2025-09-20 | [From Generalist to Specialist](https://doi.org/10.1007/978-3-032-04937-7_19) | MICCAI 2025；正式会议 | **基础模型蒸馏与高效专用部署**：融合多个分割基础模型的知识，训练面向特定领域的低成本模型，并考虑不同人口亚组表现。 |
| [20] | 2025-11-05 | [TITAN](https://doi.org/10.1038/s41591-025-03982-3) | Nature Medicine；正式期刊 | **全切片—报告多模态学习**：将自监督和图文对齐拓展到全切片层级，使切片表征可用于检索及多种下游任务。 |
| [21] | 2025-11-14 | [STPath](https://doi.org/10.1038/s41746-025-02020-3) | npj Digital Medicine；正式期刊 | **病理形态与空间转录组融合**：联合全切片与空间转录组，通过掩码表达预测学习空间相关的多模态表征。 |
| [22] | 2026-02-03 | [MedSAM-Agent](https://doi.org/10.48550/arxiv.2602.03320) | arXiv；预印本 | **多轮分割智能体与强化学习**：把交互分割组织成多步决策过程，结合结果与过程奖励，引导工具调用和迭代修正。 |
| [23] | 2026-03-04 | [Merlin](https://doi.org/10.1038/s41586-026-10181-8) | Nature；正式期刊 | **原生三维影像—报告—病历基础模型**：联合CT体积、诊断编码和报告进行多阶段学习，在诊断、预后、检索、报告及分割等任务上评估。 |
| [24] | 2026-03-14 | [RETFound Plus](https://doi.org/10.1038/s41746-026-02524-6) | npj Digital Medicine；正式期刊 | **纵向影像与疾病进展预测**：在多次随访眼底图像中建模时间和个体变化，评估未来疾病风险与风险校准。 |
| [25] | 2026-03-24 | [LungIMPACT](https://doi.org/10.1038/s41591-026-04253-5) | Nature Medicine；正式期刊 | **临床工作流的随机对照评估**：随机试验未发现AI胸片优先级排序显著缩短肺癌相关CT检查或诊断时间。 |
| [26] | 2026-04-29 | [SPARK](https://doi.org/10.1038/s41591-026-04357-y) | Nature Medicine；正式期刊 | **病理智能体与可解释生物标志物发现**：将生物学概念生成、细化、代码实现和验证串联，分析多癌种、多队列病理数据。 |
| [27] | 2026-06 | [SegMoTE](https://doi.org/10.48550/arxiv.2602.19213) | CVPR 2026；正式会议 | **低标注成本的专家混合分割**：通过token级专家混合和提示机制实现跨模态适配，强调少量可训练参数与训练数据精选。 |
| [28] | 2026-06-11 | [PathoROB](https://doi.org/10.1038/s41467-026-73923-2) | Nature Communications；正式期刊 | **基础模型的跨中心鲁棒性审计**：系统考察病理基础模型对非生物学变化的敏感性，包括实验室和扫描设备差异。 |
| [29] | 2026-07 | [FeatStainDiff](https://doi.org/10.1016/j.media.2026.104138) | Medical Image Analysis；正式期刊 | **跨染色扩散与分子表征迁移**：直接把H&E特征变换到IHC特征空间，以语义约束和频域机制支持生物标志物预测。 |
| [30] | 2026-07-10 | [NeuroVFM](https://doi.org/10.1038/s41591-026-04497-1) | Nature Medicine；正式期刊 | **医疗系统规模的三维自监督学习**：直接利用临床常规产生的MRI和CT体积，以Vol-JEPA学习跨模态神经解剖及病理表征。 |
| [31] | 2026-07-22 | [CLEAR](https://doi.org/10.1038/s41551-026-01741-4) | Nature Biomedical Engineering；正式期刊 | **临床概念驱动的可审计影像AI**：将胸片映射到临床概念空间，使模型预测可分解为具体影像观察的贡献。 |
| [32] | 2026-08-05 | [VirTues](https://doi.org/10.1038/s41586-026-10884-y) | Nature；正式期刊 | **空间蛋白组影像与虚拟组织**：在多重成像中联合建模蛋白、细胞、生态位与组织，用于标志物重建、细胞分析和患者分层。 |
| [33] | 2026-08-19 | [LiON](https://doi.org/10.1038/s41591-026-04589-y) | Nature Medicine；正式期刊 | **多期相CT与临床诊断安全网**：在多中心回顾性验证后开展单臂临床试验，作为额外阅片者识别遗漏病变并触发报告和诊疗调整。 |
| [34] | 2026-08-19 | [TMI基础模型综述](https://doi.org/10.1109/tmi.2026.3725265) | IEEE Transactions on Medical Imaging；综述 | **通用性、可信性与转化路线**：整理医学影像基础模型的组成、应用和未来挑战，为趋势归纳提供背景。 |

## 论文条目与研究切入点

**[1] Swin UNETR｜三维自监督预训练**

[1] Y. Tang, et al., "Self-Supervised Pre-Training of Swin Transformers for 3D Medical Image Analysis," *CVPR 2022*, 2022, DOI: [10.1109/cvpr52688.2022.02007](https://doi.org/10.1109/cvpr52688.2022.02007).

排序日期：2022-06；状态：正式会议；元数据核验：VERIFIED。

主要贡献：把三维解剖结构的表征学习放到下游分割之前，利用图像修复、旋转和对比任务减少对标注的依赖。

可切入问题与证据边界：值得延伸到各向异性分辨率、小病灶和跨扫描协议；与强CNN基线比较时须控制训练数据和计算预算。

**[2] CheXzero｜影像—报告对齐与零样本识别**

[2] E. Tiu, E. Talius, P. Patel, C. P. Langlotz, A. Y. Ng, and P. Rajpurkar, "Expert-level detection of pathologies from unannotated chest X-ray images via self-supervised learning," *Nature Biomedical Engineering*, 2022, DOI: [10.1038/s41551-022-00936-9](https://doi.org/10.1038/s41551-022-00936-9).

排序日期：2022-09-15；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：从胸片及其配对报告学习，使未显式训练的病理类别也能通过文本查询进行识别。

可切入问题与证据边界：从整图对齐走向病灶区域与报告语句对齐；检验否定、罕见疾病和不同医院报告措辞的影响。

**[3] RETFound｜器官专用基础模型与眼底全身健康预测**

[3] Y. Zhou, et al., "A foundation model for generalizable disease detection from retinal images," *Nature*, 2023, DOI: [10.1038/s41586-023-06555-x](https://doi.org/10.1038/s41586-023-06555-x).

排序日期：2023-09-13；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：通过大规模无标注眼底照片和OCT预训练，迁移到眼病诊断、预后及部分系统性疾病风险任务。

可切入问题与证据边界：需要区分眼底信息与年龄等混杂因素的贡献，并检验跨设备、人群和时间的校准。

**[4] LLaVA-Med｜医学视觉语言助手与指令微调**

[4] C. Li, et al., "LLaVA-Med: Training a Large Language-and-Vision Assistant for Biomedicine in One Day," *NeurIPS 2023 Datasets and Benchmarks Track*, 2023, DOI: [10.52202/075280-1240](https://doi.org/10.52202/075280-1240).

排序日期：2023-12；状态：正式会议；元数据核验：VERIFIED。

主要贡献：利用生物医学图文与生成的指令数据训练可进行开放式图像问答的助手。

可切入问题与证据边界：研究回答是否真正依赖影像，而非问题中的语言线索；用图像替换、病灶遮挡和证据定位检验。

正式发表依据：[NeurIPS 2023 Datasets and Benchmarks Track](https://proceedings.neurips.cc/paper_files/paper/2023/hash/5abcdf8ecdcacba028c6662789194572-Abstract-Datasets_and_Benchmarks.html)。

**[5] MedSAM｜可提示通用医学分割**

[5] J. Ma, Y. He, F. Li, L. Han, C. You, and B. Wang, "Segment anything in medical images," *Nature Communications*, 2024, DOI: [10.1038/s41467-024-44824-z](https://doi.org/10.1038/s41467-024-44824-z).

排序日期：2024-01-22；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：将通用分割模型适配到多种医学影像任务，通过提示实现统一分割接口。

可切入问题与证据边界：重点转向小病灶、边界模糊、提示偏差和三维连通性，而不只比较平均Dice。

**[6] CONCH｜病理图文对齐**

[6] M. Y. Lu, et al., "A visual-language foundation model for computational pathology," *Nature Medicine*, 2024, DOI: [10.1038/s41591-024-02856-4](https://doi.org/10.1038/s41591-024-02856-4).

排序日期：2024-03-19；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：将病理形态与自然语言联系起来，拓展检索、分类和文本驱动分析。

可切入问题与证据边界：医学术语与局部形态之间仍需细粒度证据对齐；评估长尾概念和语义相近亚型。

**[7] UNI｜病理自监督基础模型**

[7] R. J. Chen, et al., "Towards a general-purpose foundation model for computational pathology," *Nature Medicine*, 2024, DOI: [10.1038/s41591-024-02857-3](https://doi.org/10.1038/s41591-024-02857-3).

排序日期：2024-03-19；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：大规模病理图像预训练支持多类下游任务及少样本迁移，提供通用病理特征。

可切入问题与证据边界：值得研究跨中心染色偏移、罕见亚型和弱监督标签噪声；避免训练切片与测试患者重叠。

**[8] Prov-GigaPath｜全切片多尺度与长上下文建模**

[8] H. Xu, et al., "A whole-slide foundation model for digital pathology from real-world data," *Nature*, 2024, DOI: [10.1038/s41586-024-07441-w](https://doi.org/10.1038/s41586-024-07441-w).

排序日期：2024-05-22；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：以真实世界全切片数据学习病理表征，并用长序列架构处理大量图像块之间的联系。

可切入问题与证据边界：区分局部细胞特征和组织空间关系的独立贡献；控制图像块编码器后评估切片聚合方法。

**[9] BiomedParse｜分割、检测与识别的统一建模**

[9] T. Zhao, et al., "A foundation model for joint segmentation, detection and recognition of biomedical objects across nine modalities," *Nature Methods*, 2024, DOI: [10.1038/s41592-024-02499-w](https://doi.org/10.1038/s41592-024-02499-w).

排序日期：2024-11-18；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：跨九种生物医学模态联合处理分割、检测和识别，体现从单任务走向统一解析的趋势。

可切入问题与证据边界：研究统一任务空间中的负迁移、未知类别识别及跨模态提示表达。

**[10] MINIM｜医学合成数据与可控生成**

[10] J. Wang, et al., "Self-improving generative foundation model for synthetic medical image generation and clinical applications," *Nature Medicine*, 2024, DOI: [10.1038/s41591-024-03359-y](https://doi.org/10.1038/s41591-024-03359-y).

排序日期：2024-12-11；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：根据文字合成多器官、多模态医学影像，并评估合成数据对多种下游任务的帮助。

可切入问题与证据边界：应检验病灶保真度、罕见类别收益和对真实外部测试集的增益；不能把回顾性模拟解读为生存获益的临床证明。

**[11] PRAIM｜前瞻性真实世界人机协作**

[11] N. Eisemann, et al., "Nationwide real-world implementation of AI for cancer detection in population-based mammography screening," *Nature Medicine*, 2025, DOI: [10.1038/s41591-024-03408-6](https://doi.org/10.1038/s41591-024-03408-6).

排序日期：2025-01-07；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：在多中心乳腺筛查实施研究中，AI辅助双阅片与更高癌症检出率相关，且未损害召回率指标。

可切入问题与证据边界：研究设计为观察性，阅片者自愿使用AI；下一步是区分选择偏差、工作流改变与模型自身效果。

**[12] nnInteractive｜原生三维交互分割**

[12] F. Isensee, et al., "nnInteractive: Redefining 3D Promptable Segmentation," *arXiv*, 2025, DOI: [10.48550/arxiv.2503.08373](https://doi.org/10.48550/arxiv.2503.08373).

排序日期：2025-03-11；状态：预印本；元数据核验：LIKELY_REAL。

主要贡献：支持点、涂画、框和套索等交互方式，并接入常用医学图像查看工具。

可切入问题与证据边界：比较达到临床可用精度所需的总操作时间、修正次数和失败率；不能把挑战赛获奖写成主会论文录用。

**[13] GenMI观点综述｜医学报告生成与人机协作评估**

[13] V. M. Rao, et al., "Multimodal generative AI for medical image interpretation," *Nature*, 2025, DOI: [10.1038/s41586-025-08675-y](https://doi.org/10.1038/s41586-025-08675-y).

排序日期：2025-03-26；状态：观点文章；元数据核验：VERIFIED。

主要贡献：总结多模态生成式医学图像解读的机会及挑战，强调可靠报告生成和临床人员参与。

可切入问题与证据边界：本条是Perspective，不能作为某个新模型性能或临床有效性的实验证据。

**[14] MedSAM2｜三维与视频的可提示分割**

[14] J. Ma, et al., "MedSAM2: Segment Anything in 3D Medical Images and Videos," *arXiv*, 2025, DOI: [10.48550/arxiv.2504.03600](https://doi.org/10.48550/arxiv.2504.03600).

排序日期：2025-04-04；状态：预印本；元数据核验：LIKELY_REAL。

主要贡献：把可提示分割拓展到三维影像和医学视频，并通过用户研究考察标注成本。

可切入问题与证据边界：研究切片或帧间误差传播、关键提示选择和持续修正；将模型精度与实际人工成本一起评价。

**[15] Iris / Show and Segment｜示例驱动的上下文分割**

[15] Y. Gao, et al., "Show and Segment: Universal Medical Image Segmentation via In-Context Learning," *CVPR 2025*, 2025, DOI: [10.1109/cvpr52734.2025.01940](https://doi.org/10.1109/cvpr52734.2025.01940).

排序日期：2025-06；状态：正式会议；元数据核验：VERIFIED。

主要贡献：给定参考图像及其掩膜，模型在不针对新任务微调的情况下完成查询图像分割。

可切入问题与证据边界：研究支持样本如何自动选择、错误参考掩膜如何影响结果，以及跨域参考样本是否可靠。

**[16] RadFM｜二维与三维统一的放射学视觉语言模型**

[16] C. Wu, X. Zhang, Y. Zhang, H. Hui, Y. Wang, and W. Xie, "Towards generalist foundation model for radiology by leveraging web-scale 2D&3D medical data," *Nature Communications*, 2025, DOI: [10.1038/s41467-025-62385-7](https://doi.org/10.1038/s41467-025-62385-7).

排序日期：2025-08-23；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：联合二维和三维影像及文本，用统一框架支持问答、报告和诊断相关任务。

可切入问题与证据边界：进一步保留三维位置、检查协议及多影像对应关系；验证报告生成是否准确定位到具体病灶。

**[17] UltraBot｜超声主动采集与具身影像分析**

[17] H. Jiang, et al., "Towards expert-level autonomous carotid ultrasonography with large-scale learning-based robotic system," *Nature Communications*, 2025, DOI: [10.1038/s41467-025-62865-w](https://doi.org/10.1038/s41467-025-62865-w).

排序日期：2025-08-23；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：把图像理解、探头控制、测量和斑块筛查纳入自主颈动脉超声流程。

可切入问题与证据边界：核心课题是模型能否根据图像质量和解剖覆盖主动补扫，并在未见体型与解剖变化下安全停止。

**[18] MedSegX / MedSegDB｜开放场景分割与专家适配**

[18] S. Zhang, et al., "A generalist foundation model and database for open-world medical image segmentation," *Nature Biomedical Engineering*, 2025, DOI: [10.1038/s41551-025-01497-3](https://doi.org/10.1038/s41551-025-01497-3).

排序日期：2025-09-05；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：通过层次化数据组织和适配器专家混合，减少异质任务负迁移并评估分布外泛化。

可切入问题与证据边界：研究如何检测新医院、新模态和新器官任务，并选择适当专家；2026卷期不意味着2026首次发表。

**[19] From Generalist to Specialist｜基础模型蒸馏与高效专用部署**

[19] Q. Li, et al., "From Generalist to Specialist: Distilling a Mixture of Foundation Models for Domain-Specific Medical Image Segmentation," *MICCAI 2025*, 2025, DOI: [10.1007/978-3-032-04937-7_19](https://doi.org/10.1007/978-3-032-04937-7_19).

排序日期：2025-09-20；状态：正式会议；元数据核验：VERIFIED。

主要贡献：融合多个分割基础模型的知识，训练面向特定领域的低成本模型，并考虑不同人口亚组表现。

可切入问题与证据边界：评估教师错误如何传递及蒸馏后的最差亚组性能；避免把不需完整真值掩膜等同于零人工成本。

正式发表依据：[MICCAI 2025官方论文页](https://papers.miccai.org/miccai-2025/0355-Paper2167.html)。

**[20] TITAN｜全切片—报告多模态学习**

[20] T. Ding, et al., "A multimodal whole-slide foundation model for pathology," *Nature Medicine*, 2025, DOI: [10.1038/s41591-025-03982-3](https://doi.org/10.1038/s41591-025-03982-3).

排序日期：2025-11-05；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：将自监督和图文对齐拓展到全切片层级，使切片表征可用于检索及多种下游任务。

可切入问题与证据边界：病理报告往往只描述局部阳性区域，值得研究全切片、局部区域和报告语句的层级对应。

**[21] STPath｜病理形态与空间转录组融合**

[21] T. Huang, T. Liu, M. Babadi, R. Ying, and W. Jin, "STPath: a generative foundation model for integrating spatial transcriptomics and whole-slide images," *npj Digital Medicine*, 2025, DOI: [10.1038/s41746-025-02020-3](https://doi.org/10.1038/s41746-025-02020-3).

排序日期：2025-11-14；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：联合全切片与空间转录组，通过掩码表达预测学习空间相关的多模态表征。

可切入问题与证据边界：重点是跨患者、器官及测序平台的泛化，以及预测表达的不确定性；推断分子信号需要独立实验验证。

**[22] MedSAM-Agent｜多轮分割智能体与强化学习**

[22] S. Liu, et al., "MedSAM-Agent: Empowering Interactive Medical Image Segmentation with Multi-turn Agentic Reinforcement Learning," *arXiv*, 2026, DOI: [10.48550/arxiv.2602.03320](https://doi.org/10.48550/arxiv.2602.03320).

排序日期：2026-02-03；状态：预印本；元数据核验：LIKELY_REAL。

主要贡献：把交互分割组织成多步决策过程，结合结果与过程奖励，引导工具调用和迭代修正。

可切入问题与证据边界：奖励是否只优化掩膜重叠而忽略临床错误代价？研究可验证的过程奖励、停止策略和人工接管。

**[23] Merlin｜原生三维影像—报告—病历基础模型**

[23] L. Blankemeier, et al., "Merlin: a computed tomography vision–language foundation model and dataset," *Nature*, 2026, DOI: [10.1038/s41586-026-10181-8](https://doi.org/10.1038/s41586-026-10181-8).

排序日期：2026-03-04；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：联合CT体积、诊断编码和报告进行多阶段学习，在诊断、预后、检索、报告及分割等任务上评估。

可切入问题与证据边界：研究多期相和多序列缺失、长报告对齐、三维定位及跨医院校准；严格区分训练切片数和独立检查数。

**[24] RETFound Plus｜纵向影像与疾病进展预测**

[24] Z. Wang, et al., "Time and person sensitive foundation model for disease prediction and risk stratification," *npj Digital Medicine*, 2026, DOI: [10.1038/s41746-026-02524-6](https://doi.org/10.1038/s41746-026-02524-6).

排序日期：2026-03-14；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：在多次随访眼底图像中建模时间和个体变化，评估未来疾病风险与风险校准。

可切入问题与证据边界：区分疾病进展和设备、成像质量变化；处理不规则随访、时间泄漏及生存分析中的删失。

**[25] LungIMPACT｜临床工作流的随机对照评估**

[25] N. Woznitza, et al., "AI-based chest X-ray prioritization in the lung cancer diagnostic pathway: the LungIMPACT randomized controlled trial," *Nature Medicine*, 2026, DOI: [10.1038/s41591-026-04253-5](https://doi.org/10.1038/s41591-026-04253-5).

排序日期：2026-03-24；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：随机试验未发现AI胸片优先级排序显著缩短肺癌相关CT检查或诊断时间。

可切入问题与证据边界：研究瓶颈在阅片、预约还是转诊环节，建立从识别异常到执行后续检查的完整干预，而不只提升离线AUC。

**[26] SPARK｜病理智能体与可解释生物标志物发现**

[26] F. Trost, et al., "An agentic framework for autonomous scientific discovery in cancer pathology," *Nature Medicine*, 2026, DOI: [10.1038/s41591-026-04357-y](https://doi.org/10.1038/s41591-026-04357-y).

排序日期：2026-04-29；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：将生物学概念生成、细化、代码实现和验证串联，分析多癌种、多队列病理数据。

可切入问题与证据边界：需要锁定独立验证集，控制大规模假设搜索的多重比较，并通过独立队列和实验检验生物学解释。

**[27] SegMoTE｜低标注成本的专家混合分割**

[27] Y. Lu, et al., "SegMoTE: Token-Level Mixture of Experts for Medical Image Segmentation," *CVPR 2026*, 2026, DOI: [10.48550/arxiv.2602.19213](https://doi.org/10.48550/arxiv.2602.19213).

排序日期：2026-06；状态：正式会议；元数据核验：LIKELY_REAL。

主要贡献：通过token级专家混合和提示机制实现跨模态适配，强调少量可训练参数与训练数据精选。

可切入问题与证据边界：研究路由是否利用医院伪特征、专家失衡和极端分布变化；公开主会页面与arXiv版本分别列出。

正式发表依据：[CVPR 2026主会页面](https://openaccess.thecvf.com/content/CVPR2026/html/Lu_SegMoTE_Token-Level_Mixture_of_Experts_for_Medical_Image_Segmentation_CVPR_2026_paper.html)。上列DOI对应arXiv版本；正式会议归属另由官方页面确认。

**[28] PathoROB｜基础模型的跨中心鲁棒性审计**

[28] J. Kömen, et al., "Towards robust foundation models for digital pathology," *Nature Communications*, 2026, DOI: [10.1038/s41467-026-73923-2](https://doi.org/10.1038/s41467-026-73923-2).

排序日期：2026-06-11；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：系统考察病理基础模型对非生物学变化的敏感性，包括实验室和扫描设备差异。

可切入问题与证据边界：评估模型究竟依赖肿瘤形态还是采集中心特征；结合跨站点留出、染色扰动及最差组指标。

**[29] FeatStainDiff｜跨染色扩散与分子表征迁移**

[29] J. Zhong, et al., "Diffusion-based cross-staining feature transformation for whole slide image analysis: From H&E to IHC representation learning," *Medical Image Analysis*, 2026, DOI: [10.1016/j.media.2026.104138](https://doi.org/10.1016/j.media.2026.104138).

排序日期：2026-07；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：直接把H&E特征变换到IHC特征空间，以语义约束和频域机制支持生物标志物预测。

可切入问题与证据边界：研究表征层虚拟染色是否比像素生成更稳健，并检验配对误差、跨中心泛化和真实IHC验证。

**[30] NeuroVFM｜医疗系统规模的三维自监督学习**

[30] A. Kondepudi, et al., "Health system learning enables generalist neuroimaging models," *Nature Medicine*, 2026, DOI: [10.1038/s41591-026-04497-1](https://doi.org/10.1038/s41591-026-04497-1).

排序日期：2026-07-10；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：直接利用临床常规产生的MRI和CT体积，以Vol-JEPA学习跨模态神经解剖及病理表征。

可切入问题与证据边界：考察数据规模、目标函数和模态多样性各自的作用，并验证外部医院、稀有疾病和报告幻觉。

**[31] CLEAR｜临床概念驱动的可审计影像AI**

[31] T. Han, et al., "CLEAR: an auditable foundation model for radiology grounded in clinical concepts," *Nature Biomedical Engineering*, 2026, DOI: [10.1038/s41551-026-01741-4](https://doi.org/10.1038/s41551-026-01741-4).

排序日期：2026-07-22；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：将胸片映射到临床概念空间，使模型预测可分解为具体影像观察的贡献。

可切入问题与证据边界：研究概念是否忠实于图像、医生修改概念后决策是否按预期改变，以及域偏移下的概念稳定性。

**[32] VirTues｜空间蛋白组影像与虚拟组织**

[32] J. Wenckstern, et al., "The Virtual Tissues foundation model resolves spatial proteomics across scales," *Nature*, 2026, DOI: [10.1038/s41586-026-10884-y](https://doi.org/10.1038/s41586-026-10884-y).

排序日期：2026-08-05；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：在多重成像中联合建模蛋白、细胞、生态位与组织，用于标志物重建、细胞分析和患者分层。

可切入问题与证据边界：它属于空间生物影像边界方向；不能直接视作H&E生成真实蛋白组。重点是缺失标记校准、跨面板迁移及独立临床验证。

**[33] LiON｜多期相CT与临床诊断安全网**

[33] X. Zhang, et al., "Large-scale AI-guided liver malignancy diagnosis: multicenter study and a single-arm trial," *Nature Medicine*, 2026, DOI: [10.1038/s41591-026-04589-y](https://doi.org/10.1038/s41591-026-04589-y).

排序日期：2026-08-19；状态：正式期刊；元数据核验：VERIFIED。

主要贡献：在多中心回顾性验证后开展单臂临床试验，作为额外阅片者识别遗漏病变并触发报告和诊疗调整。

可切入问题与证据边界：需要进一步的前瞻性比较研究判断对临床结局的影响；单臂试验不能替代随机对照因果证据。

**[34] TMI基础模型综述｜通用性、可信性与转化路线**

[34] C. Niu, P. Wu, B. D. Man, and G. Wang, "Foundation Models for Medical Imaging: Status, Challenges, and Directions," *IEEE Transactions on Medical Imaging*, 2026, DOI: [10.1109/tmi.2026.3725265](https://doi.org/10.1109/tmi.2026.3725265).

排序日期：2026-08-19；状态：综述；元数据核验：VERIFIED。

主要贡献：整理医学影像基础模型的组成、应用和未来挑战，为趋势归纳提供背景。

可切入问题与证据边界：综述用于确认领域问题框架，不应当计作新的算法或临床效果实验。

## 用于选题的优先建议

| 建议题目 | 适合条件 | 关键设计 | 应优先观察的结果 |
|---|---|---|---|
| 跨医院三维病灶分割的自动提示、错误检测与交互纠正 | 有公开3D数据、可运行已有模型；最好有外部验证集 | 固定同一分割骨干，比较提示、纠错和停止策略，覆盖未见病灶 | 小病灶召回、表面误差、连通性、达到目标精度的人工分钟数 |
| 基于局部影像证据的三维报告生成与拒答 | 有配对影像—报告及专家复核资源 | 将报告语句映射到病灶区域，加入否定和反事实测试 | 临床重大错误、证据定位正确率、选择性回答覆盖率 |
| 跨中心病理基础模型的生物学信号与采集捷径解耦 | 有多个中心或扫描仪的病理数据 | 患者级拆分、留一中心测试，区分染色变化与病理结构变化 | 最差中心表现、罕见亚型召回、校准及性能稳定性 |
| 面向不规则随访的纵向影像进展预测 | 有真实随访与事件信息 | 按时间留出，明确预测起点和可用检查，处理删失与随访偏差 | 时间相关AUC/C-index、风险校准、相对基线临床变量的增量价值 |
| 带可验证过程奖励的医学影像工具智能体 | 有可运行分割、测量工具和独立评价数据 | 每步输出可核查中间结果；比较单步工具、固定流程与自适应流程 | 任务成功率、严重错误率、调用成本、错误恢复与人工接管 |
| 病理形态—空间组学的跨平台迁移与不确定性 | 有H&E和配对空间组学合作资源 | 以患者和平台留出，加入真实分子测量与独立验证 | 外部表达预测、空间生态位一致性、可信区间与临床关联复现 |

> 若以较有限算力启动，优先考虑已有基础模型之上的三维交互分割、鲁棒性评价与高效适配。若有医院配对数据，三维影像—报告对齐和纵向进展预测更有条件开展。若有病理与组学平台合作，空间生物标志物方向更适合深入。

> 临床收益需要独立评价：PRAIM为观察性实施研究，LiON包含单臂试验，LungIMPACT为随机试验且主要时间终点未见显著改善。三者的证据设计与结论不能混用。[PRAIM](https://doi.org/10.1038/s41591-024-03408-6)、[LungIMPACT](https://doi.org/10.1038/s41591-026-04253-5)、[LiON](https://doi.org/10.1038/s41591-026-04589-y)。
