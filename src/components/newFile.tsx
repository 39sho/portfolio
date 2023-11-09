import avator from "../assets/avator.png";
import Navigation from "./Navigation.astro";

<Fragment>
<div class="sticky top-0 w-full flex flex-col items-center backdrop-blur border-b-2 border-neutral-200">
<div class="flex w-full max-w-2xl">
<div class="w-12">
<a href="/">
<Image src={avator} alt="avator" class="rounded-full bg-white border-white border-8" />
</a>
</div>
<div class="flex-grow flex items-center">
<div class="w-full">
<Navigation />
</div>
</div>
</div>
</div>

</Fragment>;
