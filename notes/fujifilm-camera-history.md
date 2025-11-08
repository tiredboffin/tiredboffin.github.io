Based on [CPU-and-OS-History-Table](https://github.com/tiredboffin/fffw.wiki/CPU-and-OS-History-Table.md)

## Prehistory

The Fujifilm Fujix DS-1P camera, released in 1988, is considered the first "truly digital" camera. However, it is likely not very feasible to reverse-engineer today, as finding both the necessary software and compatible hardware is extremely difficult, if not impossible.

In January 2001, Fujifilm introduced the FinePix 4700 and the FinePix S1 Pro (Nikon F-mount with an APS-C sensor!). Both cameras used Fujifilm's innovative first generation of SuperCCD sensor design.

There’s no clear evidence about what kind of CPU architecture these early models used, as firmware updates were handled mainly through Fujifilm’s service centers rather than released publicly.

*Note:* Interestingly, Fujix DS-1P  camera was developed in collaboration with Toshiba, so it may not be a coincidence that several Fujifilm digital cameras utilized Toshiba MIPS CPUs until at least 2003–2004.

## Ancient History (2003-2010)

The oldest Fujifilm firmware available for analysis comes from the FinePix S7000, released in July 2003. Early examination suggests that the camera ran on a MIPS-based Toshiba TX4927 processor paired with the VxWorks real-time operating system from Wind River Systems. Several successors -- including the FinePix S3 Pro and S5100 -- have followed the same design path, relying on the Toshiba TX49 CPU family and the same VxWorks RTOS. To date, I believe this remains the earliest verifiable evidence of the CPU architecture used inside Fujifilm’s digital cameras.

Fujifilm began using ARM processors starting with Finepix F10 relased in August 2005. These models ran on a single-core [ARM 1136F-S CPU](https://en.wikipedia.org/wiki/ARM11) with the [Norti MiSPO RTOS](http://www.mispo.co.jp/document/no4guide.pdf).

From a reverse-engineering perspective, the Norti MiSPO RTOS based cameras appear to share far more common code with later Fujifilm models than the earlier VxWorks RTOS-based generation.

##  Classical Antiquity (2010-2016)

With the launch of the X100 in September 2010, Fujifilm transitioned to a new, more capable “EXR Processor” SoC built around a dual-core ARM Cortex-R4F CPU running an unidentified dual-kernel µITRON real-time operating system. 

The camera’s system software abstracts the underlying RTOS through a higher-level “FF RTOS” API that sits above the µITRON layer. This FF RTOS API presents a unified system interface and effectively serves as the camera’s kernel-level API.

_Note_: Dual-processor Cortex-R4 systems are not standard, and the SoC has other unique characteristics. For more details, see [EXR Processor](https://github.com/tiredboffin/fffw/wiki/EXR-Processor-Family)

The ARMv7-R-based CPU lacks an MMU, instead implementing the simpler, potentially faster [ARM Protected Memory System Architecture](https://developer.arm.com/documentation/den0042/a/The-Memory-Protection-Unit). This architecture makes "EXR Processor" cameras somewhat more accessible for reverse engineering due to the absence of address translation, also making them easier to exploit.

In 2012, the original "EXR Processor" SoC was upgraded to the "EXR Pro Processor" design, first seen in the X-E1 and X-Pro1 models. This update added an image processing co-processor as a standalone module while retaining the original "EXR Processor" as the primary SoC. 

A new "EXR II Processor" SoC was introduced in 2013, integrating the image co-processor and EXR Processor into a single module. The X100S was the first X-series camera based on this new SoC. Fujifilm continued using the "EXR II" SoC until 2016 X-E2s.

In total, there are over 20 cameras based on the "EXR", "EXR Pro" and "EXR II" processors. While they vary in hardware -- sensor size, resolution, EEPROM chips, and DRAM -- they share many key many elements, for e.g. the boot ROM, kernel loader, RTOS, and significant portions of low-level application code. From a reverse-engineering standpoint, they are quite similar, allowing most techniques and tools to be applied across all "EXR*" cameras with minimal modifications.

## Middle ages (2016-2021)

With the X100F, Fujifilm introduced the "X Processor Pro" SoC, based on a dual-core ARM Cortex-A7 architecture running the ThreadX SMP RTOS. The kernel also implements  µITRON as a layer on top of ThreadX API.

From a reverse-engineering standpoint, the use of a standard GIC interrupt controller, a conventional SMP design, and the public availability of ThreadX source code make it significantly easier to follow the structure and logic of Fujifilm’s low-level subsystems. Fujifilm maintained the same abstraction layer  -- the FF RTOS API  -- between the RTOS and the application layer, allowing insights from “X-Processor Pro” cameras to be applied to  analysis of earlier “EXR” models. Studying newer cameras can reveal details about older ones -- and vice versa.

With the X-T3, the "X Processor Pro" was upgraded to the "X Processor 4," featuring a quad-core ARM Cortex-A7. However, from a reverse-engineering perspective, it appears quite similar to the "X Processor Pro."

Cameras equipped with IBIS (X-H1, X-T4, X-S10, GFX100, etc.) use a dedicated Thumb2-based module that manages IBIS operation and coordinates it with lens stabilization (OIS).

Starting with the X-H1, X-E3 cameras also include a Renesas RL78 (for e.g. R5F10x) chip that is used to control USB charging.

The GFX100 (September, 2018) introduced a new Linux subsystem for its networking stack (and to support 5 GHz Wi-Fi), and this setup became standard in later X-Processor 5 systems.  

## Parallel History

Fujifilm has worked with several different ODM vendors over the years, creating a remarkable zoo of camera designs from a reverse-engineering perspective. Many models appear to have been developed -- and likely manufactured -- by Sanyo’s Xacti division, as they use Sanyo’s EV1 and EV2 main SoCs. These models are ARM-based; however, there are also Fujifilm-branded cameras built on Altek and Zoran platforms that feature more exotic CPU architectures.

These same ODMs supplied designs for other manufacturers too --  Nikon, Kodak, Olympus etc -- particularly for their lower-end compact lines. From a reversing perspective, it these cameras are of any interest, it might make more sense to group reversing efforts by ODM vendor rather than by brand.

The most interesting and recent “non-Fujifilm” Fujifilm-branded interchangeable-lens models seem to be the X-A3+, XA10+, XF10 and X-T100+ (released in 2016–2020), all continuing to use the Xacti (now Xacti Corporation, not Sanyo DI Solutions) design. To my knowledge, these cameras have not yet been thoroughly analyzed, and it remains unclear how much -- if anything -- they share with Fujifilm’s true in-house camera designs.

## Modern History (2022-)

The new "X Processor 5" SoC was first introduced in the X-T5 camera. This SoC is based on a quad-core ARM Cortex-A53 and runs the ThreadX SMP ARM64 RTOS, with Linux handling network stack and also some network-related tasks (for example,  frameio, ftp transfers etc).

The firmware includes references to the [CEVA XM6 IP](https://www.ceva-ip.com/product/ceva-xm6/), which is likely the engine behind subject auto-detection.

Reverse engineering the "X Processor 5" is quite similar to working with the "X Processor 4" though it requires adjustments for 64-bit addressing and RAM mapping of all devices is different.

With recent updates, Fujifilm began signing firmware images with ECDSA -- likely to comply with the EU RED requirements (see [EU Cyber Standard ETSI EN 303 645 v3.1.3](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf)), which took effect in 2025 and mandate protection against unauthorized or malicious firmware modifications. As a side effect, this also blocks the only known method of firmware downgrading -- based on header modification -- since the firmware header is now included in the signed data.








