class Message < ActiveRecord::Base
  acts_as_paranoid

  belongs_to :user, primary_key: 'uid', foreign_key: 'from_uid'

  after_create :calculate_pn_value

  private
    def calculate_pn_value
      require 'MeCab' # FIXME: not here
      pn_value = 0
      mecab = MeCab::Tagger.new("-Ochasen")
      node = mecab.parseToNode(self.body)
      while node
        prototype = node.feature.split(/,/)[6]
        unless prototype == '*'
          pn_word = PnJpWord.where(word: prototype).first
          if pn_word
            pn_value += pn_word.value
          end
        end

        node = node.next
      end

      self.update_attributes(pn_value: pn_value)
    end
end
