#!/bin/bash

# Example script to train nanoVLM with a 7B model (e.g., Qwen 2.5 7B)

# Settings for 7B model
# We reduce batch size and increase gradient accumulation to fit in memory
# You might need to adjust these based on your GPU VRAM (e.g. 24GB, 40GB, 80GB)

BATCH_SIZE=1
GRAD_ACCUM_STEPS=16
MODEL_ID="Qwen/Qwen2.5-7B-Instruct"

echo "Starting training with model: $MODEL_ID"

python train.py \
    --lm_model_type "$MODEL_ID" \
    --lm_tokenizer "$MODEL_ID" \
    --lr_language_backbone 1e-5 \
    --lr_vision_backbone 1e-5 \
    --lr_mp 5e-3 \
    --batch_size $BATCH_SIZE \
    --gradient_accumulation_steps $GRAD_ACCUM_STEPS \
    --max_training_steps 10000 \
    --eval_interval 500 \
    --no_log_wandb

# Note: If you run out of memory (OOM), consider:
# 1. Reducing batch_size to 1
# 2. Enabling gradient checkpointing (not implemented in this script but standard in transformers)
# 3. Freezing the language backbone (set --lr_language_backbone 0)
