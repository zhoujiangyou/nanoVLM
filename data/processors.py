from transformers import AutoTokenizer
import torchvision.transforms as transforms

from data.custom_transforms import DynamicResize, SplitImage, GlobalAndSplitImages

TOKENIZERS_CACHE = {}

def get_tokenizer(name, extra_special_tokens=None, chat_template=None):
    if name not in TOKENIZERS_CACHE:
        tokenizer = AutoTokenizer.from_pretrained(name, use_fast=True)
        
        if extra_special_tokens is not None:
            tokens_to_add = []
            if isinstance(extra_special_tokens, dict):
                tokens_to_add = list(extra_special_tokens.values())
            elif isinstance(extra_special_tokens, list):
                tokens_to_add = extra_special_tokens
            
            if tokens_to_add:
                tokenizer.add_special_tokens({'additional_special_tokens': tokens_to_add})

        if chat_template is not None:
            tokenizer.chat_template = chat_template
            
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
            
        TOKENIZERS_CACHE[name] = tokenizer
    return TOKENIZERS_CACHE[name]

def get_image_processor(max_img_size, splitted_image_size, resize_to_max_side_len=False):
    return transforms.Compose([
        DynamicResize(splitted_image_size, max_img_size, resize_to_max_side_len),
        transforms.ToTensor(),
        GlobalAndSplitImages(splitted_image_size),
    ])

def get_image_string(tokenizer, splitted_image_counts, mp_image_token_length):
    image_string = ""
    # splitted_image_counts is a list of tuples (n_h, n_w)
    for idx, (n_h, n_w) in enumerate(splitted_image_counts):
        if len(splitted_image_counts) > 1:
            image_string += f"<image: {idx}>"
        if hasattr(tokenizer, "global_image_token"):
            image_string += tokenizer.global_image_token
            image_string += tokenizer.image_token * mp_image_token_length
            if n_h == 1 and n_w == 1:  # If there is only one patch, treat it as the global image
                continue
        for i in range(n_h):
            for j in range(n_w):
                image_string += getattr(tokenizer, f'r{i+1}c{j+1}')
                image_string += tokenizer.image_token * mp_image_token_length
    return image_string
