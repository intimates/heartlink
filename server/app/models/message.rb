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
      prototypes = []
      while node
        prototype = node.feature.split(/,/)[6]
        prototypes.push(prototype) unless prototype == '*'
        node = node.next
      end

      pn_values = PnJpWord.where(word: prototypes).pluck(:value)
      pn_value = pn_values.sum / pn_values.size.to_f
      self.update_attributes(pn_value: pn_value)
    end
end
