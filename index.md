---
tags: [fujifilm, firmware, reverse engineering, fujikaidoku, 0xff80, fujihack, nikon-firmware-tools, chdk, ffre]
---

# Is it worth the trouble?
If you're thinking about diving into Fujifilm firmware reversing no matter what you're hoping to find -- new features, bug fixes, relaxed limitations, or tweaked film simulations -- there's currently no practical way to modify or extend Fujifilm firmware *safely*. Even older cameras don't offer a non-intrusive extension mechanism and recent models deliberately block it with digitally signed firmware images. To change anything you must modify and reflash the firmware itself, which is risky and lacks a universal at-home recovery. One mistake can permanently brick the camera. Recovery is only understood in principle for EXR-series models, and I have a proof-of-concept only for the X-E2.

So the short answer I think is: No -- it's not the most productive way to improve your photography :)

That said, if your goal is curiosity rather than customization -- if you want to learn how the firmware works, how subsystems interact, or how to build software and hardware that interoperates with Fujifilm cameras -- reversing their firmware is a great learning exercise:

 - It's **not encrypted**.
 - It's **self-contained** -- the complete system image is in the `.DAT` update file, with nothing hidden apart from the boot ROM.
 - It's built on **standard CPU architectures**, which are well supported by modern reverse-engineering tools.

# Where to start

With Fujifilm's wide range of models, not all cameras are equally approachable. To estimate the difficulty of reversing your target -- and to cooperate with other curious researchers -- start by identifying which family your camera belongs to. Do this homework up front and you'll save a lot of time chasing dead ends.

Google is your friend -- also use [this article](notes/fujifilm-camera-history.html) for a high-level overview and a [list](https://github.com/tiredboffin/fffw/wiki/CPU-and-OS-History-Table) of known Fujifilm camera families. These will help you figure out which models are related or nearly identical to your target from a reversing perspective -- meaning they use the same file format, OS, and CPU.

If firmware isn't available on Fujifilm's site (marked "NA" in the file-format column), check community archives and forums -- some updates were bundled as Windows `.exe` installers, and some were only distributed via service centers and may have leaked. Dumping firmware directly from EEPROM is possible in some cases, but safe methods without a high risk of bricking are known only for EXR models -- and ironically, firmware for those cameras is already available on Fujifilm's site (other than  version 1.0, obviously).

If you don't know how to find the firmware for your model or how to extract it safely from EEPROM, that's a good sign you should pick a different, better-supported camera for your reversing project.

Reversing many Fujifilm-branded ODM models originally designed by vendors like Sanyo, Zoran, Altek, Fujitsu, etc. is, strictly speaking, not really about "true" Fujifilm -- typically the designs or camera modules were shared across multiple camera brands, especially in the low-end segment. Some progress from other brands reversing efforts can apply to Fujifilm models, but those ODM cameras are mostly low-end point-and-shoots and are often low-value targets for reversing. This is mostly dead-end but see for e.g this [note](https://chdk.setepontos.com/index.php?topic=6484.msg87768#msg87768) on Altek based Fujiflm cameras.

The possible exception is recent ODM models such as the XA3+ and XT100+. There have been [initial steps](https://github.com/ddimensia/yi_4k_hacks) on the "LENGTH=" file-format reversing (see [also](https://dashcamtalk.com/forum/forums/yi-action-camera.153/), but for Fujifilm work so far hasn't gone much beyond basic unpacking.

# Where things stand

Most real progress has come from the [Fujihack project](https://fujihack.org/), whose original targets were the XF1 and XA2. Those two cameras belong to the EXR family, so if you want to reuse Fujihack findings the easiest route is to pick one of those cameras or another EXR-family model.

Development is now happening across several repositories.

[Fujihack repo](https://github.com/fujihack/fujihack) is tool to build a custom firmware for the XA2 (and XF1) that patches a menu item to load specially crafted executables from the SD card (for example, [DOOM](https://github.com/fujihack/fdoom.git)), and it also patches the PTP (Picture Transfer Protocol) handler to expose debugger-like commands to modify or dump RAM, upload executables etc. It provides a rudimentary infrastructure to add support for more cameras by defining offsets for "stubs" -- specific functions in the firmware, for example, functions that interact with the file system, display system, buttons. The offsets can be reversed with Ghydra, some hints are provided on how to identify the interesting functions. The project includes a [patcher](https://github.com/fujihack/patcher) -- that prepares the custom firmware -- injects custom code into the firmware file and updates checksums.

Related development runs independently in the [fffw repository](https://github.com/tiredboffin/fffw), which [focuses](https://github.com/tiredboffin/fffw/wiki/Route-0xff80) more on finding hidden functionality in fimrware than on extending firmware capabilities. That project published the simple ff80 tool, which implements Fujifilm's undocumented "jig" protocol used for diagnostics and adjustments at Service Centres and for developer logging. This protocol lets you safely dump full RAM from a live camera (no firmware modification required) and, for EXR cameras, also dump the boot ROM. This functionality was partially ported from ff80 into Fujihack code.

To prepare firmware for Ghidra or IDA, the project uses an unpublished tool called ffun. The tool decompresses compressed parts of the image and extracts or infers memory mapping information. It currently supports X* formats, with recently added support for LEN format (Xacti cameras), for details see the [list](https://github.com/
tiredboffin/fffw/wiki/CPU-and-OS-History-Table)
